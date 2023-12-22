import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "src/CommandInterface";

export const ThrowException: Command = {
    name: "no-boot-device",
    options: [
    ],
    description: "Throws an exception in the command (FOR TESTING PURPOSES ONLY)",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    ownerOnly: true,
    run: async (interaction: CommandInteraction) => {
        // im going insane i thinjk
        throw new Error("This has been logged! Mizuki! Mizu! Kanade! Mafuyu! Ena!")
    }
};