/** Libraries */
import { Response } from "express";

export const handleError = (
  res: Response,
  msg: string,
  errorRaw: any,
  status: number = 400
) => {
  console.log(errorRaw);
  res.status(status).json({
    errors: [{ msg }],
  });
};
