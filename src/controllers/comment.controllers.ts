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
    if (typeof data === "boolean") return;
    const { postDB } = data;
    if (postDB) {
      console.log("Comment maked");
      socket.broadcast.emit(POST.createComment, {
        postDB,
        user_name: user.username,
      });
      socket.emit(POST.createComment, { postDB, user_name: user.username });
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** Delete a comment */
  socket.on(POST.deleteComment, async (comment_id: string) => {
    const data = await deleteCommentService(comment_id, user._id, "comment");
    if (typeof data === "boolean") return;
    const { postDB, commentDB } = data;
    if (postDB) {
      console.log("Comment deleted");
      socket.broadcast.emit(POST.deleteComment, {
        postDB,
        commentDB,
        user_name: user.username,
      });
      socket.emit(POST.deleteComment, {
        postDB,
        commentDB,
        user_name: user.username,
      });
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** Likes */
  /** Like */
  socket.on(POST.likeComment, async (commentId: string) => {
    const data = await likeCommentService(commentId, user._id);
    if (typeof data === "boolean") return;
    const { postDB, commentDB } = data;
    if (postDB) {
      console.log("COMMENT LIKED");
      socket.broadcast.emit(POST.likeComment, {
        postDB,
        commentDB,
        user_name: user.username,
      });
      socket.emit(POST.likeComment, {
        postDB,
        commentDB,
        user_name: user.username,
      });
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
