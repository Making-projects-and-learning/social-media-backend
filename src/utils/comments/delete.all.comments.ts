/** Models */
import PostModel from "../../models/post.model";

/** Services */
import { deleteCommentService } from "../../services/comment.services";

/** Interfaces */
import {
  NonPopulatedPost,
  TypeOfDelete,
} from "../../interfaces/post.interface";

const deleteAllComments = async (
  post: NonPopulatedPost,
  userId: string,
  typeOfDelete: TypeOfDelete = "comment"
): Promise<boolean> => {
  if (post.comments) {
    const commentsCopy = [...post.comments];

    for (const comment of commentsCopy) {
      await deleteCommentService(comment.toString(), userId, typeOfDelete);
    }
  }
  const postCleaned: NonPopulatedPost | null = await PostModel.findById(
    post._id
  );
  const wereDeleted = !postCleaned?.comments?.length;

  return wereDeleted;
};

export { deleteAllComments };
