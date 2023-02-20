/** Libraries */
import { type Socket } from "socket.io";

/** Services */
import { createPostService, getPostsService } from "../services/post.services";

/** Utils */
import { socketEvents } from "../utils";

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
  socket.on(POST.getAll, async () => {
    const posts = await getPostsService();
    if (posts) {
      socket.emit(POST.getAll, { posts });
    } else {
      socket.emit(NOTIFICATION.errorGettingThePosts);
    }
  });

  /** Create a new post */
  socket.on(POST.create, async (post: Partial<Post>) => {
    const isCreated = await createPostService(post, user._id);
    if (isCreated) {
      console.log("POST CREATED");
      socket.broadcast.emit(NOTIFICATION.newPostsAvailable);
    } else {
      socket.emit(NOTIFICATION.errorToCreatePost);
    }
  });
};
