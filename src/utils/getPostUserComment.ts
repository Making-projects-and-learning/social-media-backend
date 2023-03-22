/** Models */
import PostModel from "../models/post.model";
import UserModel from "../models/user.models";
import CommentModel from "../models/comment.model";

/** Interfaces */
import {
  NonPopulatedComment,
  NonPopulatedPost,
} from "../interfaces/post.interface";
import { NonPopulatedUser } from "../interfaces/user.interface";

interface ReturnGetPostUser {
  postDB?: NonPopulatedPost | null;
  userDB?: NonPopulatedUser | null;
  commentDB?: NonPopulatedComment | null;
}

const getPostUserComment = async (
  postId: string | null = null,
  userId: string | null = null,
  commentId: string | null = null
): Promise<ReturnGetPostUser> => {
  if (postId && userId) {
    const [postDB, userDB] = await Promise.all([
      PostModel.findById(postId) as unknown as NonPopulatedPost | null,

      UserModel.findById(userId) as unknown as NonPopulatedUser | null,
    ]);

    return { postDB, userDB };
  }
  if (commentId && userId) {
    const [commentDB, userDB] = await Promise.all([
      CommentModel.findById(commentId) as unknown as NonPopulatedComment | null,

      UserModel.findById(userId) as unknown as NonPopulatedUser | null,
    ]);

    return { commentDB, userDB };
  }

  return { postDB: null, userDB: null, commentDB: null };
};

export { getPostUserComment };
