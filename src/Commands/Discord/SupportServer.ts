import { CommandInteraction, ApplicationCommandType } from "discord.js";
import { Command } from "src/CommandInterface";

export const SupportServer: Command = {
  name: "support",
  options: [],
  description: "Sends an invite link to the support server.",
  type: ApplicationCommandType.ChatInput,
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    interaction.reply({
      content: "https://discord.gg/F56qEgm7pG",
      ephemeral: true,
    });
  },
};
