import {
  CommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";

import resolve_srs_asset from "../../resolveSRSAsset";

export const ResolveAsset: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("resolve-asset")
    .setDescription("Resolves an asset from a StarRailStation asset link")
    .addStringOption(option => option
      .setName("asset")
      .setDescription("The asset to get info for")
      .setRequired(true)
    )
  ,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const asset = interaction.options.get("asset")?.value as string;

    await interaction.followUp({
      ephemeral: true,
      content: resolve_srs_asset(asset),
    });
  },
};
