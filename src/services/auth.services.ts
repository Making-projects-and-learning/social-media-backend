import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import UserModel from "../models/user.models";
import { User } from "../interfaces/user.interface";

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
export { loginService, registerService };
