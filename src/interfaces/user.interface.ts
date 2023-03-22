/** Libraries */
import mongoose from "mongoose";

/** Interfaces */
import { Comment, Post } from "./post.interface";
import { Room } from "./room.interface";

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  picture: string;
  password: string;
  description?: string;
  friends?: User[];
  groups?: Room[];
  individualRooms?: Room[];
  posts?: Post[];
  likedPosts?: Post[];
  comments?: Comment[];
  likedComments?: Comment[];
  online: boolean;
}

export interface NonPopulatedUser
  extends Omit<
    User,
    | "friends"
    | "groups"
    | "individualRooms"
    | "posts"
    | "likedPosts"
    | "comments"
    | "likedComments"
  > {
  friends?: string[];
  groups?: string[];
  individualRooms?: string[];
  posts?: string[];
  likedPosts?: string[];
  comments?: string[];
  likedComments?: string[];
}
