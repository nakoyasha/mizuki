import { EmbedBuilder } from "@discordjs/builders";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { DatabaseSystem } from "@system/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "src/CommandInterface";
import { CreateBuildDiff } from "@util/Tracker/Util/CreateBuildDiff";
import { MakeBuildDiffEmbed } from "@commands/Util/MakeBuildDiffEmbed";

export const CanaryCompare: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("canary-compare")
    .setDescription("Displays the difference between a stable build and a canary build.")
    .addStringOption(option => option
      .setName("stable-build")
      .setDescription("The build to compare against")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("canary-build")
      .setDescription("The build that the original will be compared against")
      .setRequired(true)
    ),
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const original = interaction.options.get("stable-build")?.value as string
    const compare = interaction.options.get("canary-build")?.value as string

    const stableBuildData = await DatabaseSystem.getBuildData(original, "stable");
    const canaryBuildData = await DatabaseSystem.getBuildData(compare, "canary");

    if (stableBuildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Stable Build ${original} does not exist`)
        ]
      })
      return;
    }

    if (canaryBuildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Canary Build ${compare} does not exist!`)
        ]
      })
      return;
    }

    const stringsEmbed = new EmbedBuilder()
      .setTitle(`Comparing ${original} and ${compare} - Strings`)
      .setColor(constants.colors.discord_blurple)

    const experimentsEmbed = new EmbedBuilder()
      .setTitle(`Comparing ${original} and ${compare} - Experiments`)
      .setColor(constants.colors.discord_blurple)

    const buildDiffEmbed = MakeBuildDiffEmbed(stableBuildData, canaryBuildData)

    await interaction.followUp({ embeds: [buildDiffEmbed.StringsEmbed, buildDiffEmbed.ExperimentsEmbed] })
  },
};