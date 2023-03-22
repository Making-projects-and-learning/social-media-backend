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
  picture: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/the-kings-company/image/upload/v1671396595/user-ecommerce/Avatar-Profile-PNG-Free-Image_yeonm0.png",
  },
  password: {
    type: String,
    required: true,
  },
  description: String,
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
  posts: [
    {
      type: Types.ObjectId,
      ref: "posts",
    },
  ],
  likedPosts: [
    {
      type: Types.ObjectId,
      ref: "posts",
    },
  ],
  comments: [
    {
      type: Types.ObjectId,
      ref: "comments",
    },
  ],
  likedComments: [
    {
      type: Types.ObjectId,
      ref: "comments",
    },
  ],
  online: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

const UserModel = model("users", UserSchema);

export default UserModel;
