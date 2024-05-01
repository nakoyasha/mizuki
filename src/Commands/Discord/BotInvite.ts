import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "../CommandInterface";

export const BotInvite: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Sends a bot add link")
  ,
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    interaction.reply({
      content:
        "https://discord.com/api/oauth2/authorize?client_id=1108127187820871790&permissions=139586732118&scope=bot",
      ephemeral: true,
    });
  },
};
