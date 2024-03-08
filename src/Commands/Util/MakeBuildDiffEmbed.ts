import { BuildData } from "@util/Tracker/Types/BuildData";
import { constants } from "@util/Constants";
import { EmbedBuilder } from "@discordjs/builders";
import { CreateBuildDiff } from "@util/Tracker/Util/CreateBuildDiff";


export function MakeBuildDiffEmbed(OriginalBuild: BuildData, NewBuildData: BuildData) {
  const stringsEmbed = new EmbedBuilder()
    .setTitle(`Comparing ${OriginalBuild.BuildNumber} and ${NewBuildData.BuildNumber} - Strings`)
    .setColor(constants.colors.discord_blurple)

  const experimentsEmbed = new EmbedBuilder()
    .setTitle(`Comparing ${OriginalBuild.BuildNumber} and ${NewBuildData.BuildNumber} - Experiments`)
    .setColor(constants.colors.discord_blurple)

  const BuildDiff = CreateBuildDiff(OriginalBuild, NewBuildData)

  const DiffStrings = BuildDiff.Strings
  const DiffExperiments = BuildDiff.Experiments

  if (DiffStrings.Added.length == 0 && DiffStrings.Changed.length == 0 && DiffStrings.Removed.length == 0) {
    stringsEmbed.setDescription("**Both builds are identical!**")
  } else {
    stringsEmbed.setDescription(`
      ${DiffStrings.Added.length != 0 && `**Added:** \`\`\`diff\n${DiffStrings.Added.join("\n")} \`\`\` ` || ""}
      ${DiffStrings.Changed.length != 0 && `**Changed:**\n \`\`\`diff\n${DiffStrings.Changed.join("\n")} \`\`\` ` || ""}
      ${DiffStrings.Removed.length != 0 && `**Removed:**\n \`\`\`diff\n${DiffStrings.Removed} \`\`\` ` || ""}
    `)
  }


  if (DiffExperiments.Added.length == 0 && DiffExperiments.Removed.length == 0) {
    experimentsEmbed.setDescription("**Both builds are identical!**")
  } else {
    experimentsEmbed.setDescription(`
      ${DiffExperiments.Added.length != 0 && `**Added:** \`\`\`diff\n${DiffExperiments.Added.join("\n")} \`\`\` ` || ""}
      ${DiffExperiments.Removed.length != 0 && `**Removed:**\n \`\`\`diff\n${DiffExperiments.Removed} \`\`\` ` || ""}
    `)
  }

  return {
    StringsEmbed: stringsEmbed,
    ExperimentsEmbed: experimentsEmbed
  }
}