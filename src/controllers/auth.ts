/** Libraries */
import { Request, Response } from "express";

/** Models */
import UserModel from "../models/user.models";

/** Services */
import { googleVerify } from "../services/auth";


/** Utils */
import { handleError } from "../utils";


const googleSignIn = async ({ body: { id_token } }: Request, res: Response) => {
    try {
        // const { email, name, picture: img } = await googleVerify(id_token);

        // if (!email) { throw new Error("googleVerify has failed!") };

        // const user = await UserModel.findOne({ email });

        

        // res.send(payload);
    } catch (error) {
        handleError(res, "ERROR_POST_ITEM", error);
    }
};


export { googleSignIn };