import { EmbedBuilder } from "@discordjs/builders";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "src/CommandInterface";

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
    const addedDiff = []
    const changedDiff = []
    const removedDiff = []

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

    const embed = new EmbedBuilder()
      .setTitle(`Comparing ${original} and ${compare} on ${branch}`)
      .setColor(constants.colors.discord_blurple)

    const originalStrings = JSON.parse(JSON.parse(originalBuildData.Strings)) as BuildStrings
    const compareStrings = JSON.parse(JSON.parse(compareBuildData.Strings)) as BuildStrings

    for (const [name, value] of Object.entries(compareStrings)) {
      const originalValue = originalStrings[name]

      if (originalValue == undefined) {
        addedDiff.push(`+ ${name}: ${value}`)
      } else if (originalValue != value) {
        changedDiff.push(`- ${name}: ${originalValue}`)
        changedDiff.push(`+ ${name}: ${value}`)
      }
    }

    for (const [name, value] of Object.entries(originalStrings)) {
      const compareValue = compareStrings[name]

      if (compareValue == undefined) {
        removedDiff.push(`- ${name}: ${value}`)
      }
    }


    const added = addedDiff.join("\n")
    const removed = removedDiff.join("\n")
    const changed = changedDiff.join("\n")

    if (addedDiff.length == 0 && changedDiff.length == 0 && removedDiff.length == 0) {
      embed.setDescription("**Both builds are identical!**")
    } else {
      embed.setDescription(`
      ${addedDiff.length != 0 && `**Added:** \`\`\`diff\n${added} \`\`\` ` || ""}
      ${changedDiff.length != 0 && `**Changed:**\n \`\`\`diff\n${changed} \`\`\` ` || ""}
      ${removedDiff.length != 0 && `**Removed:**\n \`\`\`diff\n${removed} \`\`\` ` || ""}
    `)
    }

    await interaction.followUp({ embeds: [embed] })
  },
};