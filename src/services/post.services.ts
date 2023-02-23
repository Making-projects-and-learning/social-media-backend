/** Libraries */
import mongoose from "mongoose";

/** Models */
import PostModel from "../models/post.model";

/** Interfaces */
import { Post } from "../interfaces/post.interface";
import { User } from "../interfaces/user.interface";
interface PopulatedPost extends Omit<Post, "owner"> {
  owner: User;
}

const getPostsService = async (): Promise<Post[] | null> => {
  try {
    const posts: Post[] = (await PostModel.find().populate(
      "owner"
    )) as PopulatedPost[];

    const filteredPosts = [...posts].sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    );

    return filteredPosts ? filteredPosts : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createPostService = async (
  Post: Partial<Post>,
  userId: mongoose.Types.ObjectId
): Promise<boolean | Post> => {
  try {
    const newPost = new PostModel({
      description: Post.description,
      imageUrl: Post.imageUrl,
      owner: userId,
    });
    const postCreated: Post = await newPost.save();

    const postDB: PopulatedPost = (await PostModel.findById(
      postCreated._id
    ).populate("owner")) as PopulatedPost;

    return postDB ? postDB : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getPostsService, createPostService };
