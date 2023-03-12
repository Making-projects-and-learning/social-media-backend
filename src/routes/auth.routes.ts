/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Controllers */
import {
  login,
  register,
  googleSignIn,
  tokenRevalidate,
} from "../controllers/auth.controllers";

/** Middlewares */
import { validateFields, jwtValidate } from "../middleware";

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

router.post(
  "/google",
  [check("id_token", "id_token is required.").not().isEmpty(), validateFields],
  googleSignIn
);

router.get("/renew", [jwtValidate, validateFields], tokenRevalidate);

export { router as authRouter };
