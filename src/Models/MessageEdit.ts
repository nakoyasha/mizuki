import { Schema, model } from "mongoose";
import type { MessageEdit } from "@mizukiTypes/MessageEdit";

export const MessageEditSchema = new Schema<MessageEdit>({
  author: {
    display_name: String,
    username: String,
    avatar_hash: String,
    id: String,
  },
  message: {
    old_content: String,
    content: String,
    id: String,
  }
});

export const GuildModel = model("MessageEdit", MessageEditSchema, "MizukiMessageEdits");
