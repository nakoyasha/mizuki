import {
  CommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../CommandInterface";

import resolve_srs_asset from "../../resolveSRSAsset";

export const ResolveAsset: Command = {
  name: "resolveasset",
  options: [
    {
      name: "asset",
      description: "The asset to get info for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  description: "Resolves an StarRailStation asset link",
  type: ApplicationCommandType.ChatInput,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const asset = interaction.options.get("asset")?.value as string;

    await interaction.followUp({
      ephemeral: true,
      content: resolve_srs_asset(asset),
    });
  },
};
