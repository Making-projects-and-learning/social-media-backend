/** Models */
import ItemModel from "../models/item";

export const itemExists = async(id: string = ''): Promise<void | Error> => {

    const itemExists = await ItemModel.findById( id );
    
    if ( !itemExists ) {
        throw new Error(`The item with id: '${id}' does not exist.`);
    };
};