import { EmbedBuilder } from "@discordjs/builders";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "src/CommandInterface";
import { CreateBuildDiff } from "@util/Tracker/Util/CreateBuildDiff";
import { MakeBuildDiffEmbed } from "@commands/Util/MakeBuildDiffEmbed";

export const BuildDiff: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("builddiff")
    .setDescription("Displays the difference for two builds.")
    .addStringOption(option => option
      .setName("original")
      .setDescription("The build to compare against")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("compare")
      .setDescription("The build that the original will be compared against")
      .setRequired(true)
    )

    .addStringOption(option => option
      .setName("branch")
      .setDescription("Required as some builds only exist on certain branches.")
      .addChoices(
        {
          name: "discord.com",
          value: "stable",
        },
        {
          name: "ptb.discord.com",
          value: "ptb",
        },
        {
          name: "canary.discord.com",
          value: "canary",
        },
      )
      .setRequired(true))
  ,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const original = interaction.options.get("original")?.value as string
    const compare = interaction.options.get("compare")?.value as string
    const branch = interaction.options.get("branch")?.value as DiscordBranch

    const originalBuildData = await DatabaseSystem.getBuildData(original, branch);
    const compareBuildData = await DatabaseSystem.getBuildData(compare, branch);

    if (originalBuildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Build ${original} does not exist on ${branch}`)
        ]
      })
      return;
    }

    if (compareBuildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Build ${compare} does not exist on ${branch}`)
        ]
      })
      return;
    }

    const buildDiffEmbed = MakeBuildDiffEmbed(originalBuildData, compareBuildData)

    await interaction.followUp({ embeds: [buildDiffEmbed.StringsEmbed, buildDiffEmbed.ExperimentsEmbed] })
  },
};