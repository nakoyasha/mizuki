import { CommandInteraction, ApplicationCommandType, Guild, SlashCommandBuilder } from "discord.js";
import { Command, CommandV2 } from "src/CommandInterface";
import GuildCreate from "src/Listeners/GuildCreate";

export const CreateGuildData: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("missing-guild-data")
    .setDescription("Creates GuildData for the current guild (FOR TESTING PURPOSES ONLY)"),
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    GuildCreate(interaction.guild as Guild);
  },
};
