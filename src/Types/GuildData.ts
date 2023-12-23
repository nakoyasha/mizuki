import mongoose from "mongoose"
import { RegexRule } from "./RegexRule"

export type GuildData = {
    _id: mongoose.Schema.Types.ObjectId,
    GuildId: String,
    ModTicketEnabled: Boolean,
    ModTicketChannelId?: String,
    ShameChannelEnabled: Boolean,
    BanShameChannel?: String,
    ModRolesIds?: String[]
    RegexRules?: RegexRule[]
}