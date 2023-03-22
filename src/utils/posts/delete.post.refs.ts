/** Models */
import UserModel from "../../models/user.models";

/** Interfaces */
import { NonPopulatedUser } from "../../interfaces/user.interface";
import {
  NonPopulatedPost,
  TypeOfDelete,
} from "../../interfaces/post.interface";

const deletePostRefs = async (
  post: NonPopulatedPost,
  typeOfDelete: TypeOfDelete
): Promise<boolean> => {
  if (typeOfDelete !== "post") return true;
  if (post) {
    const userDB: NonPopulatedUser | null = await UserModel.findOneAndUpdate(
      { _id: post.owner },
      {
        $pull: {
          posts: post._id,
          likedPosts: post._id,
        },
      },
      { new: true }
    );

    if (userDB) {
      return (
        !userDB?.posts?.includes(post._id.toString()) ||
        !userDB?.likedPosts?.includes(post._id.toString())
      );
    }
  }
  return false;
};

export { deletePostRefs };
