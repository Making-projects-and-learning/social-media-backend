/** Libraries */
import { Request, Response } from "express";
import { type Socket } from "socket.io";

/** Services */
import {
  createPostService,
  deletePostService,
  getPostsService,
  likePostService,
  unLikePostService,
} from "../services/post.services";

/** Utils */
import { handleError, socketEvents } from "../utils";

/** Interfaces */
import { Post } from "../interfaces/post.interface";
import { User } from "../interfaces/user.interface";
interface CustomSocket extends Socket {
  post?: Partial<Post>;
  user?: User | any;
}

export const postController = (socket: CustomSocket) => {
  /** Socket types event */
  const { POST, NOTIFICATION } = socketEvents;

  const { user } = socket;

  /** Create a new post */
  socket.on(POST.create, async (post: Partial<Post>) => {
    const postDB = await createPostService(post, user._id);
    if (postDB) {
      console.log("NOTIFICATIONS SENDED");
      socket.broadcast.emit(NOTIFICATION.newPostsAvailable, postDB);
      socket.emit(POST.create, postDB);
    } else {
      socket.emit(NOTIFICATION.errorToCreatePost);
    }
  });

  /** Delete a post */
  socket.on(POST.delete, async (post_id: string) => {
    const postDB = await deletePostService(post_id, user._id, "post");
    if (postDB) {
      console.log("POST DELETED");
      socket.broadcast.emit(POST.delete, postDB);
      socket.emit(POST.delete, postDB);
    } else {
      socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** Likes */
  /** Like */
  socket.on(POST.like, async (post_id: string) => {
    const postDB = await likePostService(post_id, user._id);
    if (postDB) {
      console.log("POST LIKED");
      socket.broadcast.emit(POST.like, { postDB, user_name: user.username });
      socket.emit(POST.like, { postDB, user_name: user.username });
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });

  /** UnLike */
  socket.on(POST.unLike, async (post_id: string) => {
    const postDB = await unLikePostService(post_id, user._id);
    if (postDB) {
      console.log("POST UNLIKED");
      socket.broadcast.emit(POST.unLike, postDB);
      socket.emit(POST.unLike, postDB);
    } else {
      // socket.emit(NOTIFICATION.errorToDeletePost);
    }
  });
};

/** get all posts */
export const getAllPosts = async (req: Request, res: Response) => {
  const { skip, limit } = req.query;
  const posts = await getPostsService(Number(skip), Number(limit));
  if (!posts) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  res.status(200).json({
    posts,
  });
};
