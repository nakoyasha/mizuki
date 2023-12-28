import { CommandInteraction, PermissionsBitField, ChatInputApplicationCommandData } from "discord.js";



export interface Command extends ChatInputApplicationCommandData {
    deferReply?: boolean
    ownerOnly?: boolean
    // Permission bits. ex. PermissionBitField.Flags.KickMembers
    permissions?: [bigint?]
    // Which servers the command be availabled in (not defining this array will result in it being a global command)
    servers?: [string]
    run: (interaction: CommandInteraction) => void;
}