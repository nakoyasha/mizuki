import mongoose from "mongoose";
import { RegexRule } from "./RegexRule";

export type GuildData = {
  _id: mongoose.Schema.Types.ObjectId;
  GuildId: string;
  ModTicketEnabled: boolean;
  ModTicketChannelId?: string;
  ShameChannelEnabled: boolean;
  BanShameChannel?: string;
  ModRolesIds?: string[];
  RegexRules?: RegexRule[];
};
