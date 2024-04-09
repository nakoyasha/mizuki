import { BuildData } from "@util/Tracker/Types/BuildData";
import { constants } from "@util/Constants";
import { EmbedBuilder } from "@discordjs/builders";
import { CreateBuildDiff } from "@util/Tracker/Util/CreateBuildDiff";
import assert from "assert";

enum EmbedType {
  Strings = "Strings",
  Experiments = "Experiments",
}

const STRING_LIMIT = 4096

function makeEmbedForDescription(originalBuild: BuildData, newBuildData: BuildData, type: EmbedType, description: string) {
  const embeds: EmbedBuilder[] = []

  function makeEmbed(text: string) {
    const embed = new EmbedBuilder()
      .setTitle(`Comparing ${originalBuild.BuildNumber} and ${newBuildData.BuildNumber} - ${type}`)
      .setColor(constants.colors.discord_blurple)

    if (text.length > 4096) {
      let chunks = text.match(/.{1,4096}/g)
      assert(chunks !== null, "Returned chunks are null!")
      const firstChunk = chunks.shift()
      assert(firstChunk, "First chunk is null ???")
      embed.setDescription(firstChunk)

      chunks.forEach(chunk => {
        makeEmbed(chunk)
      })
    } else {
      embed.setDescription(text)
    }

    embeds.push(embed)
  }

  makeEmbed(description)

  return embeds
}

export function MakeBuildDiffEmbed(OriginalBuild: BuildData, NewBuildData: BuildData) {
  const BuildDiff = CreateBuildDiff(OriginalBuild, NewBuildData)

  const diffStrings = BuildDiff.Strings
  const diffExperiments = BuildDiff.Experiments

  const stringsDescription = `
      ${diffStrings.Added.length != 0 && `**Added:** \`\`\`diff\n${diffStrings.Added.join("\n")} \`\`\` ` || ""}
      ${diffStrings.Changed.length != 0 && `**Changed:**\n \`\`\`diff\n${diffStrings.Changed.join("\n")} \`\`\` ` || ""}
      ${diffStrings.Removed.length != 0 && `**Removed:**\n \`\`\`diff\n${diffStrings.Removed} \`\`\` ` || ""}
    `
  const experimentsDescription = `
      ${diffExperiments.Added.length != 0 && `**Added:** \`\`\`diff\n${diffExperiments.Added.join("\n")} \`\`\` ` || ""}
      ${diffExperiments.Removed.length != 0 && `**Removed:**\n \`\`\`diff\n${diffExperiments.Removed} \`\`\` ` || ""}
    `

  const stringEmbeds = makeEmbedForDescription(OriginalBuild, NewBuildData, EmbedType.Strings, stringsDescription)
  const experimentEmbeds = makeEmbedForDescription(OriginalBuild, NewBuildData, EmbedType.Experiments, experimentsDescription)

  return {
    StringsEmbed: stringEmbeds,
    ExperimentsEmbed: experimentEmbeds
  }
}