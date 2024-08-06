import { Schema, model } from "mongoose";
import { GuildData, GuildFeatures } from "../Types/GuildData";

export const GuildSchema = new Schema<GuildData>({
  _id: Schema.Types.ObjectId,
  guild_id: String,
  regex_rules: {
    type: [
      {
        name: String,
        rule: String,
        response: String,
      },
    ],
    required: false,
  },
  log_channel: {
    type: String,
    required: false
  },
  features: Array<GuildFeatures>,
});

export const GuildModel = model("Guild", GuildSchema, "GuildData");
