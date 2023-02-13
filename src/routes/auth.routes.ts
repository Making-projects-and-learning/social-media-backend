import { Router } from "express";
import { check } from "express-validator";
import { login, register } from "../controllers/auth.controllers";
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

router.post(
  "/register",
  [
    check("name", "name is required").not().isEmpty(),
    check(
      "username",
      "username is required and it must be at least 6 characters long"
    ).isLength({
      min: 6,
    }),
    check("email", "Email required and must be a valid email").isEmail(),
    check(
      "password",
      "Password is required and it must be at least 8 characters long"
    ).isLength({
      min: 8,
    }),
    validateFields,
  ],
  register
);

export { router as authRouter };
