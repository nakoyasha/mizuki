import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "src/CommandInterface";

export const ExperimentRollout: Command = {
    name: "experimentrollout",
    options: [
    ],
    description: "Gets the current rollout percentage for a Discord experiment (owner-only because its way too heavy to run)",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    ownerOnly: true,
    run: async (interaction: CommandInteraction) => {
        // TODO: uhhh make the fuckin thing????? ??
    }
};