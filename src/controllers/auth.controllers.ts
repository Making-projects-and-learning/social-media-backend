import { Request, Response } from "express";
import { loginService, registerService } from "../services/auth.services";
import { handleError } from "../utils";

const login = async (req: Request, res: Response): Promise<void> => {
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

const register = async (req: Request, res: Response): Promise<void> => {
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
export { login, register };
