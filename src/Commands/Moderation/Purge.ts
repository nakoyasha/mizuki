import {
  ApplicationCommandOptionType,
  CommandInteraction,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import { Command } from "../../CommandInterface";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

export const Purge: Command = {
  name: "purge",
  permissions: [PermissionsBitField.Flags.ManageMessages],
  options: [
    {
      name: "amount",
      description: "Amount of messages to purge",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  description:
    "Removes a specific amount of messages. This does not account for the bot's message.",
  deferReply: false,
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
