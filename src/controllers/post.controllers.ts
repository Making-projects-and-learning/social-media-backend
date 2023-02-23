/** Libraries */
import { Request, Response } from "express";
import { type Socket } from "socket.io";

/** Services */
import { createPostService, getPostsService } from "../services/post.services";

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
      socket.broadcast.emit(NOTIFICATION.newPostsAvailable);
      socket.emit(POST.create, postDB);
    } else {
      socket.emit(NOTIFICATION.errorToCreatePost);
    }
  });
};

export const getAllPosts = async (_req: Request, res: Response) => {
  const posts = await getPostsService();
  if (!posts) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  res.status(200).json({
    posts,
  });
};
