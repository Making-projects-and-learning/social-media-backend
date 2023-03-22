/** Libraries */
import mongoose from "mongoose";

/** Interfaces */
import { User } from "./user.interface";

export type TypeOfDelete = "comment" | "post" | "user";

export interface Comment {
  _id: mongoose.Types.ObjectId;
  content: string;
  imageUrl: string;
  owner: User;
  post: Post;
  likedBy?: User[];
  createdAt: Date;
}

export interface NonPopulatedComment
  extends Omit<Comment, "owner" | "post" | "likedBy"> {
  owner: string;
  post: string;
  likedBy?: string[];
}

export interface Post {
  _id: mongoose.Types.ObjectId;
  description: string;
  imageUrl: string;
  owner: User;
  likedBy?: User[];
  comments?: Comment[];
  createdAt: Date;
}

export interface NonPopulatedPost
  extends Omit<Post, "owner" | "likedBy" | "comments"> {
  owner: string;
  likedBy?: string[];
  comments: string[];
}
