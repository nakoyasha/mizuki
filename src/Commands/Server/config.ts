import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "../../CommandInterface";

export const Setup: Command = {
  name: "setup",
  options: [
    {
      name: "setting",
      description: "What setting to modify",
      type: ApplicationCommandOptionType.String,
    },
  ],
  deferReply: false,
  description: "Configures the bot's settings for this server.",
  run: async (interaction: CommandInteraction) => {
    if (
      interaction.user.id != process.env.OWNER_ID ||
      interaction.user.id != interaction.guild?.ownerId
    ) {
      interaction.reply({
        content:
          "You may not use this command as it is locked to server owners and bot developers.",
        ephemeral: true,
      });
      return;
    }
  },
};
