/** Libraries */
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { NextFunction, Request, Response } from "express";

/** Models */
import UserModel from "../models/user.models";

/** Utils */
import { socketEvents } from "../utils/socket.events";
import { verifyToken } from "../utils";

/** Interfaces */
import { User } from "../interfaces/user.interface";

interface CustomSocket extends Socket {
  user?: User | any;
  email?: string;
}

interface CustomRequest extends Request {
  user?: User | any;
  email?: string;
}

export const jwtValidate = async (
  req: CustomRequest,
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

    const user = await UserModel.find({ email });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      msg: "invalid token.",
      err,
    });
  }
};

export const socketJwtValidate = async (
  socket: CustomSocket,
  next: { (err?: ExtendedError | undefined): void; (): void }
) => {
  /** Socket types event */
  const { NOTIFICATION } = socketEvents;

  /** Token from the client */
  const token = socket.handshake.auth.token;
  try {
    if (!token || token === undefined) {
      return socket.emit(NOTIFICATION.errorJwtAuth);
    }

    const { email } = await verifyToken(token);

    const user = await UserModel.find({ email });

    socket.user = user[0] as unknown as User;

    next();
  } catch (err) {
    console.log(err);
    return socket.emit(NOTIFICATION.errorJwtAuth);
  }
};
