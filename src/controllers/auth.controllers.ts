import { Request, Response } from "express";
import { loginService } from "../services/auth.services";
import { handleError } from "../utils";

const login = async (req: Request, res: Response): Promise<void> => {
  const user = await loginService(req.body);
  if (!user) {
    return handleError(res, "Inavlid username or password", {}, 403);
  }
  res.status(200).json({
    message: "user logged in yey",
  });
};

export { login };
