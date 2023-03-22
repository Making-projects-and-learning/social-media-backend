/** Models */
import PostModel from "../../models/post.model";
import UserModel from "../../models/user.models";

/** Interfaces */
import { NonPopulatedUser } from "../../interfaces/user.interface";
import {
  NonPopulatedComment,
  NonPopulatedPost,
} from "../../interfaces/post.interface";

const deleteCommentRefs = async (
  comment: NonPopulatedComment
): Promise<boolean> => {
  if (comment) {
    const [postDB, userDB] = await Promise.all([
      PostModel.findOneAndUpdate(
        { _id: comment.post },
        { $pull: { comments: comment._id } },
        { new: true }
      ) as unknown as NonPopulatedPost | null,

      UserModel.findOneAndUpdate(
        { _id: comment.owner },
        {
          $pull: {
            comments: comment._id,
            likedComments: comment._id,
          },
        },
        { new: true }
      ) as unknown as NonPopulatedUser | null,
    ]);

    if (postDB && userDB) {
      return (
        !postDB?.comments?.includes(comment._id.toString()) ||
        !userDB?.comments?.includes(comment._id.toString())
      );
    }
  }
  return false;
};

export { deleteCommentRefs };
