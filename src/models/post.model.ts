import { Types, model, Schema, Document } from "mongoose";
import { Post } from "../interfaces/post.interface";

type PostDocument = Post & Document;

const PostSchema = new Schema<PostDocument>({
  description: {
    type: String,
    required: [true, 'Property "description" is required.'],
  },
  imageUrl: String,
  owner: {
    type: Types.ObjectId,
    ref: "users",
    required: [true, 'Property "owner" is required.'],
  },
  likedBy: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  comments: [
    {
      type: Types.ObjectId,
      ref: "comments",
    },
  ],
  createdAt: {
    type: Date,
    required: [true, 'Property "createAt" is required.'],
  },
});

const PostModel = model("posts", PostSchema);

export default PostModel;
