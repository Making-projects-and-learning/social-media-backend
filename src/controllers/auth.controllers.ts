/** Libraries */
import { Request, Response } from "express";

/** Services */
import {
  loginService,
  registerService,
  googleLoginService,
  renewService,
} from "../services/auth.services";

/** Utils */
import { handleError } from "../utils";

/** Interfaces */
import { User } from "../interfaces/user.interface";
interface CustomRequest extends Request {
  user?: User | any;
}

const login = async (req: CustomRequest, res: Response): Promise<void> => {
  const data = await loginService(req.body);
  if (!data) {
    return handleError(res, "Inavlid username or password", {}, 403);
  }
  const { user, token } = data;
  res.status(200).json({
    message: "user logged in yey",
    user,
    token,
  });
};

const register = async (req: CustomRequest, res: Response): Promise<void> => {
  const data = await registerService(req.body);
  if (!data) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  const { user, token } = data;
  res.status(200).json({
    message: "user signned up",
    user,
    token,
  });
};

const googleSignIn = async (
  { body: { id_token } }: CustomRequest,
  res: Response
) => {
  const data = await googleLoginService(id_token);
  if (!data) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  const { user, token } = data;
  res.status(200).json({
    message: "user logged with google",
    user,
    token,
  });
};

const tokenRevalidate = async (req: CustomRequest, res: Response) => {
  const data = await renewService(req.user[0]);
  if (!data) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  const { user, token } = data;
  res.status(200).json({
    message: "token renewed",
    user,
    token,
  });
};

export { login, register, googleSignIn, tokenRevalidate };
