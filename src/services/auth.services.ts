/** Libraries */
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

/** Models */
import UserModel from "../models/user.models";

/** Utils */
import { generateToken, googleVerify } from "../utils";

/** Interfaces */
import { User } from "../interfaces/user.interface";
import { GooglePayload } from "../interfaces/auth.interface";

type LoginBody = {
  username: string;
  password: string;
};

type RegisterBody = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type AuthReturnType = {
  user: Partial<User>;
  token: string;
} | null;

const loginService = async ({
  username,
  password,
}: LoginBody): Promise<AuthReturnType> => {
  const user: User | null = await UserModel.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  if (!process.env.JWT_SECRET) throw new Error("the jwt secret is undefined");
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  const { password: pass, ...rest } = JSON.parse(JSON.stringify(user));
  return {
    user: rest,
    token,
  };
};

const registerService = async ({
  name,
  username,
  email,
  password,
}: RegisterBody): Promise<AuthReturnType> => {
  const hashedPassword = await bcrypt.hash(
    password,
    process.env.BRYPT_SALT_OR_ROUNDS || 11
  );
  const newUser = new UserModel({
    name,
    username,
    email,
    password: hashedPassword,
  });
  if (!process.env.JWT_SECRET) throw new Error("the jwt secret is undefined!");
  try {
    const user: User = await newUser.save();
    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET
    );
    const { password, ...rest } = JSON.parse(JSON.stringify(user));
    return {
      user: rest,
      token,
    };
  } catch (e) {
    return null;
  }
};

const renewService = async (user: User): Promise<AuthReturnType> => {
  const { email } = user;

  const token = await generateToken(email);

  return {
    user,
    token,
  };
};

const googleLoginService = async (
  id_token: string
): Promise<AuthReturnType> => {
  const credential = (await googleVerify(id_token)) as unknown as GooglePayload;

  if (!credential) throw new Error("Google verification has failed!");

  const { email, given_name } = credential;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const data = {
        name: given_name,
        username: given_name,
        email: email,
        password: ":P",
      };

      const userNew = new UserModel(data);

      const userNewFinish = await userNew.save();

      const token = await generateToken(userNewFinish.email);

      return {
        user: userNewFinish,
        token,
      };
    }

    const token = await generateToken(user.email);

    return {
      user,
      token,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { loginService, registerService, googleLoginService, renewService };
