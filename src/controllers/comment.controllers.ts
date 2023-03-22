/** Libraries */
// import { Request, Response } from "express";
import { type Socket } from "socket.io";

/** Services */

/** Utils */
// import { handleError, socketEvents } from "../utils";
import { socketEvents } from "../utils";

/** Interfaces */
import { Comment, Post } from "../interfaces/post.interface";
import { User } from "../interfaces/user.interface";
import {
  createCommentService,
  deleteCommentService,
  likeCommentService,
  unLikeCommentService,
} from "../services/comment.services";
interface CustomSocket extends Socket {
  post?: Partial<Post>;
  user?: User | any;
}

export const commentController = (socket: CustomSocket) => {
  /** Socket types event */
  const { POST } = socketEvents;

  const { user } = socket;

  /** Comments */
  /** Make a comment */
  socket.on(POST.createComment, async (post_id: string, comment: Comment) => {
    const data = await createCommentService(comment, user._id, post_id);
    if (data) {
      console.log("Comment maked");
      socket.broadcast.emit(POST.createComment, data);
      socket.emit(POST.createComment, data);
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** Delete a comment */
  socket.on(POST.deleteComment, async (comment_id: string) => {
    const postDB = await deleteCommentService(comment_id, user._id, "comment");
    if (postDB) {
      console.log("Comment deleted");
      socket.broadcast.emit(POST.deleteComment, postDB);
      socket.emit(POST.deleteComment, postDB);
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** Likes */
  /** Like */
  socket.on(POST.likeComment, async (commentId: string) => {
    const data = await likeCommentService(commentId, user._id);
    if (data) {
      console.log("COMMENT LIKED");
      socket.broadcast.emit(POST.likeComment, data);
      socket.emit(POST.likeComment, data);
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** UnLike */
  socket.on(POST.unLikeComment, async (commentId: string) => {
    const data = await unLikeCommentService(commentId, user._id);
    if (data) {
      console.log("COMMENT UNLIKED");
      socket.broadcast.emit(POST.unLikeComment, data);
      socket.emit(POST.unLikeComment, data);
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });
};
