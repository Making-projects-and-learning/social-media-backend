import mongoose from "mongoose";
import { User } from "./user.interface";
import { Message } from "./message.interface";

export interface Room {
  _id: mongoose.Types.ObjectId;
  users: User[];
  messages: Message[];
}
