import {
  ApplicationCommandOptionType,
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

export const Purge: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Removes a specific amount of messages. This does not account for the bot's message.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("How many messages to purge?")
      .setRequired(true)
    ),
  permissions: [PermissionsBitField.Flags.ManageMessages],
  deferReply: false,
  contexts: ["guild"],
  run: async (interaction: CommandInteraction) => {
    const amount = interaction.options.get("amount")?.value as number;
    try {
      const channel = interaction.channel as TextChannel;
      const messages = await channel.bulkDelete(amount, true);

      interaction.reply({
        content: `Deleted ${messages.size} messages`,
        ephemeral: true,
      });
    } catch (error) {
      const embed = MakeErrorEmbed(`Failed to purge: ${error}`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
