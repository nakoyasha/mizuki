import mongoose from "mongoose";

export const GuildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    GuildId: String,
    ModTicketEnabled: Boolean,
    ModTicketChannelId: { type: String, required: false },
    ShameChannelEnabled: Boolean,
    BanShameChannel: { type: String, required: false },
    ModRolesIds: { type: [String], required: false },
})

export const GuildModel = mongoose.model("Guild", GuildSchema, "MizukiGuilds")