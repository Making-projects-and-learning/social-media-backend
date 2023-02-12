import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import UserModel from "../models/user.models";
import { User } from "../interfaces/user.interface";

type LoginBody = {
  username: string;
  password: string;
};

type LoginServiceReturnType = {
  user: User;
  token: string;
} | null;

const loginService = async ({
  username,
  password,
}: LoginBody): Promise<LoginServiceReturnType> => {
  const user: User | null = await UserModel.findOne({ username, password });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  if (!process.env.JWT_SECRET) throw new Error("the jwt secret is undefined");
  const token = jwt.sign(user.email, process.env.JWT_SECRET);
  return {
    user,
    token,
  };
};

export { loginService };
