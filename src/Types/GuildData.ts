import mongoose from "mongoose";
import { RegexRule } from "./RegexRule";

export enum GuildFeatures {
  AutoInvitesDisabler = "auto_disable_invites",
  RegexReplies = "regex_replies"
}

export type GuildData = {
  _id: mongoose.Schema.Types.ObjectId;
  guild_id: string;
  regex_rules?: RegexRule[];
  log_channel?: string,
  features: Array<GuildFeatures>,
};
