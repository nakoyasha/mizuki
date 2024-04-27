import type { BuildData } from "@util/Tracker/Types/BuildData";
import { constants } from "@util/Constants";
import { EmbedBuilder } from "@discordjs/builders";
// import { CreateBuildDiff } from "@mizuki-bot/tracker/Diff/CreateBuildDiff";
import assert from "node:assert";
import Logger from "@system/Logger";

enum EmbedType {
  Strings = "Strings",
  Experiments = "Experiments",
}

const logger = new Logger("Commands/Util/MakeBuildDiffEmbed")
const STRING_LIMIT = 6000

function makeEmbedForDescription(originalBuild: BuildData, newBuildData: BuildData, type: EmbedType, description: string) {
  const embeds: EmbedBuilder[] = []

  function makeEmbed(text: string, isOriginal = false) {
    const embed = new EmbedBuilder()
    if (isOriginal === true) {
      embed.setTitle(`Comparing ${originalBuild.build_number} and ${newBuildData.build_number} - ${type}`)
    }

    embed.setColor(constants.colors.discord_blurple)
    embeds.push(embed)

    if (text.length > STRING_LIMIT) {
      console.log(`Embed too long: ${text.length} > ${STRING_LIMIT}, text:\n${text}`)
      const chunks = text.match(/(?:.+\n?){5}/g)

      if (chunks === null || chunks === undefined) {
        logger.error("Failed to make chunks; sending the whole message instead");
        embed.setDescription(text)
        return;
      }

      console.log(`Chunk'd ${text.length} into ${chunks.length} chunks`)

      const firstChunk = chunks.shift()
      assert(firstChunk, "First chunk is null ???")
      makeEmbed(firstChunk)

      for (const chunk of chunks) {
        makeEmbed(chunk)
      }

    } else {
      const _text = `\`\`\`diff\n${text}\`\`\``
      embed.setDescription(_text)
    }

  }

  makeEmbed(description, true)

  return embeds
}

export function MakeBuildDiffEmbed(OriginalBuild: BuildData, NewBuildData: BuildData) {
  // const BuildDiff = CreateBuildDiff(OriginalBuild, NewBuildData)

  // const diffStrings = BuildDiff.Strings
  // const diffExperiments = BuildDiff.Experiments

  // const addedStrings = diffStrings.Added.join("\n")
  // const removedStrings = diffStrings.Removed.join("\n")
  // const changedStrings = diffStrings.Changed.join("\n")

  // const addedExperiments = diffExperiments.Added.join("\n")
  // const removedExperiments = diffExperiments.Removed.join("\n")

  // const stringsDescription = `
  //     ${diffStrings.Added.length !== 0 && `**Added:** ${addedStrings}` || ""}
  //     ${diffStrings.Changed.length !== 0 && `**Changed:**\n \n${changedStrings} ` || ""}
  //     ${diffStrings.Removed.length !== 0 && `**Removed:**\n \n${removedStrings}  ` || ""}
  //   `
  // const experimentsDescription = `
  //     ${diffExperiments.Added.length !== 0 && `**Added:** \n${addedExperiments}  ` || ""}
  //     ${diffExperiments.Removed.length !== 0 && `**Removed:**\n diff\n${removedExperiments}  ` || ""}
  //   `

  // const stringEmbeds = makeEmbedForDescription(OriginalBuild, NewBuildData, EmbedType.Strings, stringsDescription)
  // const experimentEmbeds = makeEmbedForDescription(OriginalBuild, NewBuildData, EmbedType.Experiments, experimentsDescription)

  // TODO: make it work again!
  return {
    StringsEmbed: [],
    ExperimentsEmbed: []
  }
}