import { Types, model, Schema, Document } from "mongoose";
import { Post } from "../interfaces/post.interface";

type PostDocument = Post & Document;

const PostSchema = new Schema<PostDocument>({
  title: String,
  description: String,
  imageUrl: String,
  owner: {
    type: Types.ObjectId,
    ref: "users",
  },
  likedBy: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});

const PostModel = model("posts", PostSchema);

export default PostModel;
