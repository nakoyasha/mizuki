import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";

export const Base64: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("base64")
    .setDescription("Encodes/decodes a string to Base64")
    .addSubcommand(subcommand => subcommand
      .setName("encode")
      .setDescription("Encodes the provided string")
      .addStringOption(option => option
        .setName("value")
        .setDescription("The string to encode")
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("decode")
      .setDescription("Decodes the provided string")
      .addStringOption(option => option
        .setName("value")
        .setDescription("The string to decode")
      )
    )
  ,
  run: async (interaction: ChatInputCommandInteraction) => {
    const command = interaction.options.getSubcommand()
    const value = interaction.options.get("value")?.value as string

    switch (command) {
      case "encode":
        await interaction.reply({
          content: btoa(value)
        })
        break;
      case "decode":
        await interaction.reply({
          content: atob(value)
        })
        break;
      default:
        break;
    }
  },
};
