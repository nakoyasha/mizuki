import { CommandInteraction, ChatInputApplicationCommandData } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    deferReply?: boolean
    run: (interaction: CommandInteraction) => void;
}