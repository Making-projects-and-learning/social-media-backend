/** Libraries */
import { Request, Response } from "express";

/** Services */
import {
  insertCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
} from "../services/item";

/** Utils */
import { handleError } from "../utils";

const getItem = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await getCar(id);
    const data = response ? response : "NOT_FOUND";
    res.send(data);
  } catch (error) {
    handleError(res, "ERROR_GET_ITEM", error);
  }
};

const getItems = async (_req: Request, res: Response) => {
  try {
    const response = await getCars();
    res.send(response);
  } catch (error) {
    handleError(res, "ERROR_GET_ITEMS", error);
  }
};

const updateItem = async ({ params, body }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await updateCar(id, body);
    res.send(response);
  } catch (error) {
    handleError(res, "ERROR_UPDATE_ITEM", error);
  }
};

const postItem = async ({ body }: Request, res: Response) => {
  try {
    const responseItem = await insertCar(body);
    res.send(responseItem);
  } catch (error) {
    handleError(res, "ERROR_POST_ITEM", error);
  }
};

const deleteItem = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await deleteCar(id);
    res.send(response);
  } catch (error) {
    handleError(res, "ERROR_DELETE_ITEM", error);
  }
};

export { getItem, getItems, postItem, updateItem, deleteItem };
