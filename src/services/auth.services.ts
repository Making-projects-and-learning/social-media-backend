import * as bcrypt from "bcrypt";
import UserModel from "../models/user.models";
import { User } from "../interfaces/user.interface";
type LoginBody = {
  username: string;
  password: string;
};
const loginService = async ({
  username,
  password,
}: LoginBody): Promise<User | null> => {
  const user: User | null = await UserModel.findOne({ username, password });
  if (!user) return null;
  if (await bcrypt.compare(password, user.password)) return user;
  return null;
};

export { loginService };
