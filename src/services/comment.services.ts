/** Models */
import PostModel from "../models/post.model";
import UserModel from "../models/user.models";
import CommentModel from "../models/comment.model";

/** Utils */
import { deleteCommentRefs, deleteImage, getPostUserComment } from "../utils";

/** Interfaces */
import { User } from "../interfaces/user.interface";
import {
  Comment,
  NonPopulatedComment,
  Post,
  TypeOfDelete,
} from "../interfaces/post.interface";

interface CommentServiceReturn {
  commentDB: Comment;
  postDB: Post;
  userDB: User;
}

/** Populate options */
const optionsCommentsPopulate = {
  path: "comments",
  options: { sort: [{ createdAt: "desc" }] },
  populate: {
    path: "owner",
  },
};

const createCommentService = async (
  comment: Partial<Comment>,
  userId: string,
  postId: string
): Promise<boolean | CommentServiceReturn> => {
  try {
    /** We get the post and user from DB */
    const { postDB, userDB } = await getPostUserComment(postId, userId);

    /** Creating new comment */
    const newComment = new CommentModel({
      content: comment.content,
      imageUrl: comment.imageUrl,
      createdAt: comment.createdAt,
      owner: userId,
      post: postId,
    });
    const commentCreated: Comment = await newComment.save();

    if (postDB && userDB) {
      /** Populate comment and update post and user */
      const [commentDB, updatedPost, updatedUser] = await Promise.all([
        CommentModel.findById(commentCreated._id).populate("owner"),

        PostModel.findOneAndUpdate(
          { _id: postDB._id },
          { $push: { comments: commentCreated._id } },
          { new: true }
        )
          .populate("owner")
          .populate(optionsCommentsPopulate) as unknown as Post | null,

        UserModel.findOneAndUpdate(
          { _id: userDB._id },
          { $push: { comments: commentCreated._id } },
          { new: true }
        ).populate("comments") as unknown as User | null,
      ]);

      if (commentDB && updatedPost && updatedUser) {
        return {
          commentDB: commentDB,
          postDB: updatedPost,
          userDB: updatedUser,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteCommentService = async (
  comment_id: string,
  userId: string,
  typeOfDelete: TypeOfDelete
): Promise<boolean | Post> => {
  try {
    /** We search the comment in database */
    const commentDB: NonPopulatedComment | null = await CommentModel.findById(
      comment_id
    );

    if (commentDB?.imageUrl) {
      const isDeleted = await deleteImage(commentDB?.imageUrl);
      if (!isDeleted) return false;
    }

    if (
      (commentDB && userId.toString() === commentDB.owner.toString()) ||
      (commentDB && typeOfDelete === "post")
    ) {
      const wereDeleted = await deleteCommentRefs(commentDB);
      if (wereDeleted) {
        const [postDB, _commentDeleted] = await Promise.all([
          PostModel.findById(commentDB.post)
            .populate("owner")
            .populate(optionsCommentsPopulate) as unknown as Post | null,

          CommentModel.findByIdAndDelete(
            comment_id
          ) as unknown as NonPopulatedComment | null,
        ]);

        return postDB ? postDB : false;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/** Likes */
/** Like a comment */
const likeCommentService = async (
  commentId: string,
  userId: string
): Promise<boolean | Omit<CommentServiceReturn, "commentDB">> => {
  try {
    /** React comment and user from DB */
    const { commentDB, userDB } = await getPostUserComment(
      null,
      userId,
      commentId
    );

    if (commentDB && userDB) {
      /** If the comment is already on the user list return false */
      if (userDB?.likedComments!.includes(commentDB?._id.toString()))
        return false;

      const [_updatedComment, updatedUser] = await Promise.all([
        CommentModel.findOneAndUpdate(
          { _id: commentDB._id },
          { $push: { likedBy: userDB._id } },
          { new: true }
        ) as unknown as Comment | null,

        UserModel.findOneAndUpdate(
          { _id: userDB._id },
          { $push: { likedComments: commentDB._id } },
          { new: true }
        ).populate("comments") as unknown as User | null,
      ]);

      /** Read the post already updated (for populated matter) */
      const postDB = await PostModel.findById(commentDB.post)
        .populate("owner")
        .populate(optionsCommentsPopulate);

      if (postDB && updatedUser) {
        return {
          postDB,
          userDB: updatedUser,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

/** UnLike a comment */
const unLikeCommentService = async (
  commentId: string,
  userId: string
): Promise<boolean | Omit<CommentServiceReturn, "commentDB">> => {
  try {
    /** React comment and user from DB */
    const { commentDB, userDB } = await getPostUserComment(
      null,
      userId,
      commentId
    );

    if (commentDB && userDB) {
      const [_updatedComment, updatedUser] = await Promise.all([
        CommentModel.findOneAndUpdate(
          { _id: commentDB._id },
          { $pull: { likedBy: userDB._id } },
          { new: true }
        ) as unknown as Comment | null,

        UserModel.findOneAndUpdate(
          { _id: userDB._id },
          { $pull: { likedComments: commentDB._id } },
          { new: true }
        ).populate("comments") as unknown as User | null,
      ]);

      /** Read the post already updated */
      const postDB = await PostModel.findById(commentDB.post)
        .populate("owner")
        .populate(optionsCommentsPopulate);

      if (postDB && updatedUser) {
        return {
          postDB,
          userDB: updatedUser,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  createCommentService,
  deleteCommentService,
  likeCommentService,
  unLikeCommentService,
};
