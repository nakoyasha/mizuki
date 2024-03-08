import { EmbedBuilder } from "@discordjs/builders";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "src/CommandInterface";
import { Experiment } from "@util/Tracker/Types/Experiments";

type BuildStrings = { [key: string]: string }

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
    const addedStrings = []
    const changedStrings = []
    const removedStrings = []

    const addedExperiments = []
    const changedExperiments = []
    const removedExperiments = []

    const original = interaction.options.get("original")?.value as string
    const compare = interaction.options.get("compare")?.value as string
    const branch = interaction.options.get("branch")?.value as DiscordBranch

    const originalBuildData = await DatabaseSystem.getBuildData(original, branch);
    const compareBuildData = await DatabaseSystem.getBuildData(compare, branch);

    if (originalBuildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Build ${origin} does not exist on ${branch}`)
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

    const stringsEmbed = new EmbedBuilder()
      .setTitle(`Comparing ${original} and ${compare} on ${branch} - Strings`)
      .setColor(constants.colors.discord_blurple)

    const experimentsEmbed = new EmbedBuilder()
      .setTitle(`Comparing ${original} and ${compare} on ${branch} - Experiments`)
      .setColor(constants.colors.discord_blurple)

    const originalStrings = JSON.parse(JSON.parse(originalBuildData.Strings)) as BuildStrings
    const compareStrings = JSON.parse(JSON.parse(compareBuildData.Strings)) as BuildStrings

    const originalExperiments = JSON.parse(JSON.parse(originalBuildData.Experiments))
    const compareExperiments = JSON.parse(JSON.parse(compareBuildData.Experiments))

    // strings pass
    for (const [name, value] of Object.entries(compareStrings)) {
      const originalValue = originalStrings[name]

      if (originalValue == undefined) {
        addedStrings.push(`+ ${name}: ${value}`)
      } else if (originalValue != value) {
        changedStrings.push(`- ${name}: ${originalValue}`)
        changedStrings.push(`+ ${name}: ${value}`)
      }
    }

    for (const [name, value] of Object.entries(originalStrings)) {
      const compareValue = compareStrings[name]

      if (compareValue == undefined) {
        removedStrings.push(`- ${name}: ${value}`)
      }
    }

    // experiments pass
    for (const [name, value] of Object.entries(originalExperiments)) {
      const experiment = (value as Experiment)
      const experimentName = experiment?.title || experiment.name
      const originalValue = originalExperiments[name] as Experiment

      if (originalValue == undefined) {
        addedExperiments.push(`+ ${name}: ${experimentName}`)
      } else if (originalValue.title != experiment.title) {
        changedExperiments.push(`- ${name}: ${experimentName}`)
        changedExperiments.push(`+ ${name}: ${experimentName}`)
      }
    }

    for (const [name, value] of Object.entries(compareExperiments)) {
      const experiment = (value as Experiment)
      const experimentName = experiment?.title || experiment.name
      const compareValue = originalExperiments[name]

      if (compareValue == undefined) {
        removedExperiments.push(`- ${name}: ${experimentName}`)
      }
    }


    if (addedStrings.length == 0 && changedStrings.length == 0 && removedStrings.length == 0) {
      stringsEmbed.setDescription("**Both builds are identical!**")
    } else {
      stringsEmbed.setDescription(`
      ${addedStrings.length != 0 && `**Added:** \`\`\`diff\n${addedStrings.join("\n")} \`\`\` ` || ""}
      ${changedStrings.length != 0 && `**Changed:**\n \`\`\`diff\n${changedStrings.join("\n")} \`\`\` ` || ""}
      ${removedStrings.length != 0 && `**Removed:**\n \`\`\`diff\n${removedStrings} \`\`\` ` || ""}
    `)
    }


    if (addedExperiments.length == 0 && changedExperiments.length == 0 && removedExperiments.length == 0) {
      stringsEmbed.setDescription("**Both builds are identical!**")
    } else {
      stringsEmbed.setDescription(`
      ${addedExperiments.length != 0 && `**Added:** \`\`\`diff\n${addedExperiments.join("\n")} \`\`\` ` || ""}
      ${changedExperiments.length != 0 && `**Changed:**\n \`\`\`diff\n${changedExperiments.join("\n")} \`\`\` ` || ""}
      ${removedExperiments.length != 0 && `**Removed:**\n \`\`\`diff\n${removedExperiments} \`\`\` ` || ""}
    `)
    }

    await interaction.followUp({ embeds: [stringsEmbed, experimentsEmbed] })
  },
};