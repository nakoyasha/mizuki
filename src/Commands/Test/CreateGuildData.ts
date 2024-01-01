import { CommandInteraction, ApplicationCommandType, Guild } from "discord.js";
import { Command } from "src/CommandInterface";
import GuildCreate from "src/Listeners/GuildCreate";

export const CreateGuildData: Command = {
  name: "missing-guild-data",
  options: [],
  description:
    "Creates GuildData for the current guild (FOR TESTING PURPOSES ONLY)",
  type: ApplicationCommandType.ChatInput,
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    GuildCreate(interaction.guild as Guild);
  },
};
