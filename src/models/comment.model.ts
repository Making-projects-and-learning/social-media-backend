import { Types, model, Schema, Document } from "mongoose";
import { Comment } from "../interfaces/post.interface";

type CommentDocument = Comment & Document;

const CommentSchema = new Schema<CommentDocument>({
  content: {
    type: String,
    required: [true, 'Property "content" is required.'],
  },
  imageUrl: String,
  owner: {
    type: Types.ObjectId,
    ref: "users",
    required: [true, 'Property "owner" is required.'],
  },
  post: {
    type: Types.ObjectId,
    ref: "posts",
    required: [true, 'Property "post" is required.'],
  },
  likedBy: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  createdAt: {
    type: Date,
    required: [true, 'Property "createAt" is required.'],
  },
});

const CommentModel = model("comments", CommentSchema);

export default CommentModel;
