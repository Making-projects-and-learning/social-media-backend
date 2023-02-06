/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Controllers */
import {
  deleteItem,
  getItem,
  getItems,
  postItem,
  updateItem,
} from "../controllers/item";

/** Middlewares */
import { validateFields } from "../middleware";
 
/** Utils */
import { itemExists } from "../utils";

const router = Router();

router.get("/", [
  validateFields
], getItems);

router.get("/:id", [
  check('id', 'The id is not a valid mongo id.').isMongoId(),
  check('id').custom(itemExists),
  validateFields
], getItem);

router.post("/", [
  check('color', '"color" is required.').not().isEmpty(),
  check('color', '"color" must have at least 3 length.').isLength({ min: 3 }),
  check('color', '"color" cant be higher than 16 length.').isLength({ max: 16 }),
  check('color', '"color" should be a string.').isString(),

  check('gas', '"gas" is required.').not().isEmpty(),
  check('gas', '"gas" must have at least 6 length.').isLength({ min: 6 }),
  check('gas', '"gas" should be a string.').isString(),

  check('year', '"year" is required.').not().isEmpty(),
  check('year', '"year" should be a number.').isNumeric(),

  check('description', '"description" is required.').not().isEmpty(),
  check('description', '"description" must have at least 6 length.').isLength({ min: 6 }),
  check('description', '"description" cant be higher than 60 length.').isLength({ max: 60 }),
  check('description', '"description" should be a string.').isString(),

  check('price', '"price" is required.').not().isEmpty(),
  check('price', '"price" should be a number.').isNumeric(),

  check('name', '"name" is required.').not().isEmpty(),
  check('name', '"name" must have at least 6 length.').isLength({ min: 6 }),
  check('name', '"name" cant be higher than 30 length.').isLength({ max: 30 }),
  check('name', '"name" should be a string.').isString(),
  validateFields
], postItem);

router.put("/:id", [
  check('id', 'The id is not a valid mongo id.').isMongoId(),
  check('id').custom(itemExists),
  check('color', '"color" is required.').not().isEmpty(),
  check('color', '"color" must have at least 3 length.').isLength({ min: 3 }),
  check('color', '"color" cant be higher than 16 length.').isLength({ max: 16 }),
  check('color', '"color" should be a string.').isString(),

  check('gas', '"gas" is required.').not().isEmpty(),
  check('gas', '"gas" must have at least 6 length.').isLength({ min: 6 }),
  check('gas', '"gas" should be a string.').isString(),

  check('year', '"year" is required.').not().isEmpty(),
  check('year', '"year" should be a number.').isNumeric(),

  check('description', '"description" is required.').not().isEmpty(),
  check('description', '"description" must have at least 6 length.').isLength({ min: 6 }),
  check('description', '"description" cant be higher than 60 length.').isLength({ max: 60 }),
  check('description', '"description" should be a string.').isString(),

  check('price', '"price" is required.').not().isEmpty(),
  check('price', '"price" should be a number.').isNumeric(),

  check('name', '"name" is required.').not().isEmpty(),
  check('name', '"name" must have at least 6 length.').isLength({ min: 6 }),
  check('name', '"name" cant be higher than 30 length.').isLength({ max: 30 }),
  check('name', '"name" should be a string.').isString(),
  validateFields
], updateItem);

router.delete("/:id", [
  check('id', 'The id is not a valid mongo id.').isMongoId(),
  check('id').custom(itemExists),
  validateFields
], deleteItem);

export { router as itemRoutes };
