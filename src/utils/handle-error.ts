/** Libraries */
import { Response } from "express";

export const handleError = (res: Response, msg: string, errorRaw: any) => {
  console.log(errorRaw);
  res.status(400).json({
    errors: [{ msg }]
  })
};