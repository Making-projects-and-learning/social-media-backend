/** Libraries */
import { type Socket } from "socket.io";

/** Sockets */
import { postController } from "../controllers/post.controllers";
import { commentController } from "../controllers/comment.controllers";

/** Utils */
import { socketEvents } from "../utils";
const { DISCONNECT } = socketEvents;

/** Interfaces */
import { User } from "../interfaces/user.interface";
interface CustomSocket extends Socket {
  user?: User | any;
  email?: string;
}

export const Sockets = (socket: CustomSocket) => {
  console.log(`User ${socket.user.name} connected.`);

  socket.on(DISCONNECT, () => {
    console.log(`User ${socket.user.name} disconnected.`);
  });

  /** Here we are going to put the all the sockets */
  /** Posts */
  postController(socket);

  /** Comments */
  commentController(socket);

  /** Chats */
  // postController(socket);

  /** Chat goups */
  // postController(socket);
};
