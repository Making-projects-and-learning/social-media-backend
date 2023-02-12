/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Controllers */
import { googleSignIn } from "../controllers/auth";

/** Middlewares */
import { validateFields } from "../middleware";

const router = Router();

router.post('/google', [
  check('id_token', 'id_token is required.').not().isEmpty(),
  validateFields
], googleSignIn );

export { router as authRoutes };
