import { CommandInteraction, ApplicationCommandType } from "discord.js";
import { Command } from "src/CommandInterface";

export const BotInvite: Command = {
  name: "invite",
  options: [],
  description: "Sends a bot invite.",
  type: ApplicationCommandType.ChatInput,
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    interaction.reply({
      content:
        "https://discord.com/api/oauth2/authorize?client_id=1108127187820871790&permissions=139586732118&scope=bot",
      ephemeral: true,
    });
  },
};
