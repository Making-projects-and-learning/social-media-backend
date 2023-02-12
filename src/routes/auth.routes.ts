import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/auth.controllers";
import { validateFields } from "../middleware";

const router = Router();

router.post(
  "/login",
  [
    check(
      "username",
      "username is required and it must be at least 6 characters"
    ).isLength({
      min: 6,
    }),
    check(
      "password",
      "password is required and it must be at least 8 characters"
    ).isLength({
      min: 8,
    }),
    validateFields,
  ],
  login
);

export { router as authRouter };
