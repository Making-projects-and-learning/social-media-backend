/** Libraries */
import mongoose from "mongoose";

/** Models */
import PostModel from "../models/post.model";
import UserModel from "../models/user.models";

/** Interfaces */
import { Post } from "../interfaces/post.interface";
import { User } from "../interfaces/user.interface";

interface PopulatedPost extends Omit<Post, "owner"> {
  owner: User;
}

interface DeletedPost extends Omit<Post, "owner"> {
  owner: string;
}

const getPostsService = async (
  skip: number,
  limit: number
): Promise<Post[] | null> => {
  try {
    const posts: Post[] = (await PostModel.find()
      .sort({ ["createdAt"]: "desc" })
      .skip(skip)
      .limit(limit)
      .populate("owner")) as PopulatedPost[];

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

    const postDB: PopulatedPost = (await PostModel.findById(
      postCreated._id
    ).populate("owner")) as PopulatedPost;

    return postDB ? postDB : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deletePostService = async (
  post_id: string,
  userId: string
): Promise<boolean | Post> => {
  try {
    const postDB: DeletedPost | null = await PostModel.findById(post_id);
    if (postDB && userId.toString() === postDB.owner.toString()) {
      const postDeleted: Post | null = await PostModel.findByIdAndDelete(
        post_id
      );

      return postDeleted ? postDeleted : false;
    } else {
      return false;
    }
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
    const [postDB, userDB] = await Promise.all([
      PostModel.findById(post_id),

      UserModel.findById(userId),
    ]);

    if (postDB && userDB) {
      /** If the post is already on the user list return false */
      if (userDB?.likedPosts!.includes(postDB?._id.toString())) return false;

      const newUserData = {
        _id: userDB._id,
        name: userDB.name,
        username: userDB.username,
        email: userDB.email,
        password: userDB.password,
        posts: userDB.posts,
        friends: userDB.friends,
        groups: userDB.groups,
        individualRooms: userDB.individualRooms,
        online: userDB.online,
        likedPosts: [...userDB?.likedPosts!, postDB._id],
      };

      const newPostData = {
        _id: postDB._id,
        description: postDB.description,
        owner: postDB.owner,
        createdAt: postDB.createdAt,
        likedBy: [...postDB?.likedBy!, userDB._id],
      };

      const [updatedPost, _updatedUser] = await Promise.all([
        PostModel.findByIdAndUpdate(post_id, newPostData, {
          new: true,
        }).populate("owner"),

        UserModel.findByIdAndUpdate(userDB._id, newUserData, { new: true }),
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
    const [postDB, userDB] = await Promise.all([
      PostModel.findById(post_id),

      UserModel.findById(userId),
    ]);

    if (postDB && userDB) {
      const newUserData = {
        _id: userDB._id,
        name: userDB.name,
        username: userDB.username,
        email: userDB.email,
        password: userDB.password,
        posts: userDB.posts,
        friends: userDB.friends,
        groups: userDB.groups,
        individualRooms: userDB.individualRooms,
        online: userDB.online,
        likedPosts: userDB?.likedPosts!.filter(
          (e) => e.toString() !== postDB._id.toString()
        ),
      };

      const newPostData = {
        _id: postDB._id,
        description: postDB.description,
        owner: postDB.owner,
        createdAt: postDB.createdAt,
        likedBy: postDB?.likedBy!.filter(
          (e) => e.toString() !== userDB._id.toString()
        ),
      };

      const [updatedPost, _updatedUser] = await Promise.all([
        PostModel.findByIdAndUpdate(post_id, newPostData, {
          new: true,
        }).populate("owner"),

        UserModel.findByIdAndUpdate(userDB._id, newUserData, { new: true }),
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
