import { Types, Document, Schema, model } from "mongoose";
import { Message } from "../interfaces/message.interface";

type MessageDocument = Omit<Message, "_id"> & Document;

const MessageSchema = new Schema<MessageDocument>({
  from: {
    type: Types.ObjectId,
    ref: "users",
    required: true,
  },
  to: [
    {
      type: Types.ObjectId,
      ref: "users",
    },
  ],
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const MessageModel = model("messages", MessageSchema);

export default MessageModel;
