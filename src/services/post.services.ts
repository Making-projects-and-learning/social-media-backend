/** Libraries */
import mongoose from "mongoose";

/** Models */
import PostModel from "../models/post.model";
import UserModel from "../models/user.models";

/** Utils */
import {
  deleteAllComments,
  getPostUserComment,
  deletePostRefs,
  deleteImage,
} from "../utils";

/** Interfaces */
import { NonPopulatedUser, User } from "../interfaces/user.interface";
import {
  NonPopulatedPost,
  Post,
  TypeOfDelete,
} from "../interfaces/post.interface";

/** Populate options */
const optionsCommentsPopulate = {
  path: "comments",
  options: { sort: [{ createdAt: "desc" }] },
  populate: {
    path: "owner",
  },
};

const getPostsService = async (
  skip: number,
  limit: number
): Promise<Post[] | null> => {
  try {
    const posts: Post[] = await PostModel.find()
      .sort({ ["createdAt"]: "desc" })
      .skip(skip)
      .limit(limit)
      .populate("owner")
      .populate(optionsCommentsPopulate);

    return posts ? posts : null;
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
      createdAt: Post.createdAt,
      owner: userId,
    });
    const postCreated: Post = await newPost.save();

    const postDB: Post | null = await PostModel.findById(postCreated._id)
      .populate("owner")
      .populate(optionsCommentsPopulate);

    if (postDB) {
      const userDB: NonPopulatedUser | null = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { posts: postDB._id } },
        { new: true }
      );
      return postDB && userDB ? postDB : false;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deletePostService = async (
  post_id: string,
  userId: string,
  typeOfDelete: TypeOfDelete = "post"
): Promise<boolean | Post> => {
  try {
    const postDB: NonPopulatedPost | null = await PostModel.findById(post_id);

    if (postDB?.imageUrl) {
      const isDeleted = await deleteImage(postDB?.imageUrl);
      if (!isDeleted) return false;
    }
    if (
      (postDB && userId.toString() === postDB.owner.toString()) ||
      (postDB && typeOfDelete === "user")
    ) {
      const areCommentsDeleted = await deleteAllComments(
        postDB,
        userId,
        typeOfDelete
      );
      const areRefsDeleted = await deletePostRefs(postDB, typeOfDelete);
      if (areCommentsDeleted && areRefsDeleted) {
        const postDeleted: Post | null = await PostModel.findByIdAndDelete(
          post_id
        );
        return postDeleted ? postDeleted : false;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/** Like a post */
const likePostService = async (
  post_id: string,
  userId: string
): Promise<boolean | Post> => {
  try {
    const { postDB, userDB } = await getPostUserComment(post_id, userId);

    if (postDB && userDB) {
      /** If the post is already on the user list return false */
      if (userDB?.likedPosts!.includes(postDB?._id.toString())) return false;

      const [updatedPost, _updatedUser] = await Promise.all([
        PostModel.findOneAndUpdate(
          { _id: postDB._id },
          { $push: { likedBy: userDB._id } },
          { new: true }
        )
          .populate("owner")
          .populate(optionsCommentsPopulate) as unknown as Post | null,

        UserModel.findOneAndUpdate(
          { _id: userDB._id },
          { $push: { likedPosts: postDB._id } },
          { new: true }
        ).populate("comments") as unknown as User | null,
      ]);

      return updatedPost ? updatedPost : false;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

/** UnLike a post */
const unLikePostService = async (
  post_id: string,
  userId: string
): Promise<boolean | Post> => {
  try {
    const { postDB, userDB } = await getPostUserComment(post_id, userId);

    if (postDB && userDB) {
      const [updatedPost, _updatedUser] = await Promise.all([
        PostModel.findOneAndUpdate(
          { _id: postDB._id },
          { $pull: { likedBy: userDB._id } },
          { new: true }
        )
          .populate("owner")
          .populate(optionsCommentsPopulate) as unknown as Post | null,

        UserModel.findOneAndUpdate(
          { _id: userDB._id },
          { $pull: { likedPosts: postDB._id } },
          { new: true }
        ).populate("comments") as unknown as User | null,
      ]);

      return updatedPost ? updatedPost : false;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  getPostsService,
  createPostService,
  deletePostService,
  likePostService,
  unLikePostService,
};
