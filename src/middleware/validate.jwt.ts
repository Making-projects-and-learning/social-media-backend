/** Libraries */
import { NextFunction, Request, Response } from "express";

/** Models */
import UserModel from "../models/user.models";

/** Utils */
import { verifyToken } from "../utils";

export const jwtValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-token");

    if (!token || token === undefined) {
      return res.status(401).json({
        msg: "There is no token in the request",
      });
    }

    const { email } = await verifyToken(token);
    
    req.email = email;

    const user = await UserModel.find({ email })

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      msg: "invalid token.",
      err,
    });
  }
};