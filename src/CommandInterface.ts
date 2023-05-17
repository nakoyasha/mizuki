import { CommandInteraction, ChatInputApplicationCommandData } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (interaction: CommandInteraction) => void;
}