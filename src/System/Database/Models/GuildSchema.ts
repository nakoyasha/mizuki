import { Schema, model } from "mongoose";
import { GuildData } from "../../../Types/GuildData";

export const GuildSchema = new Schema<GuildData>({
  _id: Schema.Types.ObjectId,
  GuildId: String,
  ModTicketEnabled: Boolean,
  ModTicketChannelId: { type: String, required: false },
  ShameChannelEnabled: Boolean,
  BanShameChannel: { type: String, required: false },
  ModRolesIds: { type: [String], required: false },
  RegexRules: {
    type: [
      {
        name: String,
        rule: String,
        response: String,
      },
    ],
    required: false,
  },
});

export const GuildModel = model("Guild", GuildSchema, "MizukiGuilds");
