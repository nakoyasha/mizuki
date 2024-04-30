import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "src/CommandInterface";

export const Avatar: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets a user's profile picture")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the profile picture of")
        .setRequired(true),
    ),
  deferReply: false,
  contexts: ["user", "guild"],
  run: async (interaction: CommandInteraction) => {
    const user = interaction.options.getUser("user", true);
    const avatar = user.displayAvatarURL({ extension: "png", size: 4096 });

    await interaction.reply(avatar);
  }
}
