import { Schema, model, Document, Types } from "mongoose";
import { User } from "../interfaces/user.interface";

type UserDocument = User & Document;

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: String,
  posts: [
    {
      type: Types.ObjectId,
      ref: "posts",
    },
  ],
  friends: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  groups: [
    {
      type: Types.ObjectId,
      ref: "rooms",
    },
  ],
  individualRooms: [
    {
      type: Types.ObjectId,
      ref: "rooms",
    },
  ],
  likedPosts: [
    {
      type: Types.ObjectId,
      ref: "posts",
    },
  ],
  online: {
    type: Boolean,
    default: false,
  },
});

const UserModel = model("users", UserSchema);

export default UserModel;
