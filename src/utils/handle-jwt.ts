import { sign, verify } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "token.01010101";

export const generateToken = (email: string) => {
  const jwt = sign({ email }, JWT_SECRET, {
    expiresIn: "4h",
  });
  return jwt;
};

export const verifyToken = (jwt: string) => {
  const isOk = verify(jwt, JWT_SECRET);
  return isOk;
};