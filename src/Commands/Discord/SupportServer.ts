import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "../CommandInterface";

export const SupportServer: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Sends an invite link to the support server.")
  ,
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    interaction.reply({
      content: "https://discord.gg/F56qEgm7pG",
      ephemeral: true,
    });
  },
};
