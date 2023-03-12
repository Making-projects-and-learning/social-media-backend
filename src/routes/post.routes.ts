/** Libraries */
import { Router } from "express";
// import { check } from "express-validator";

/** Controllers */
import { getAllPosts } from "../controllers/post.controllers";

/** Middlewares */
import { validateFields, jwtValidate } from "../middleware";

const router = Router();

router.get("/", [jwtValidate, validateFields], getAllPosts);

export { router as postRouter };
