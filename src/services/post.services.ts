/** Libraries */
import mongoose from "mongoose";

/** Models */
import PostModel from "../models/post.model";

/** Interfaces */
import { Post } from "../interfaces/post.interface";

const getPostsService = async (): Promise<Post[] | null> => {
  try {
    const posts: Post[] = await PostModel.find();
    return posts ? posts : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createPostService = async (
  Post: Partial<Post>,
  userId: mongoose.Types.ObjectId
): Promise<boolean> => {
  try {
    const newPost = new PostModel({
      title: Post.title,
      description: Post.description,
      imageUrl: Post.imageUrl,
      owner: userId,
    });
    const postCreated: Post = await newPost.save();
    return postCreated ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getPostsService, createPostService };
