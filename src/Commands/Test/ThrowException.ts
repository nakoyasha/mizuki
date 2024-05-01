import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { Command, CommandV2 } from "../..//CommandInterface";

export const ThrowException: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("no-boot-device")
    .setDescription("Throws an exception in the command (FOR TESTING PURPOSES ONLY)"),
  deferReply: false,
  ownerOnly: true,
  run: async () => {
    // im going insane i thinjk
    throw new Error("This has been logged! Mizuki! Mizu! Kanade! Mafuyu! Ena!");
  },
};
