import { BuildData } from "@util/Tracker/Types/BuildData";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { MizukiRoutine } from "@mizukiTypes/MizukiRoutine";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import Logger from "@system/Logger";
import { compileBuildData } from "@util/Tracker/Util/CompileBuildData";

import * as Sentry from "@sentry/node"
import { Mizuki } from "@system/Mizuki";
import { MakeBuildDiffEmbed } from "@commands/Util/MakeBuildDiffEmbed";
import { TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { constants } from "@util/Constants";

import config from "../../config.json"

const logger = new Logger("Routines/SaveBuild");

async function saveBuild(branch: DiscordBranch) {
  try {
    logger.log(`Compiling current ${branch} build..`)
    const build = await compileBuildData(branch) as BuildData

    logger.log(`Saving build ${build.BuildNumber}`)
    await DatabaseSystem.createBuildData(build)
    logger.log(`Build ${build.BuildNumber} has been saved`)
    return build
  } catch (err) {
    Sentry.captureException(err)
    logger.error(`Compile failed: ${err}`)
  }
}

async function postBuildDiff(NewBuild: BuildData, LastBuild: BuildData, Channel: TextChannel) {
  const buildDiffEmbed = MakeBuildDiffEmbed(LastBuild, NewBuild)

  await Channel.send({
    content: "New discord build!",
    embeds: [buildDiffEmbed.StringsEmbed, buildDiffEmbed.ExperimentsEmbed]
  })
}

async function getAndSaveBuild(branch: DiscordBranch) {
  const lastBuild = await DatabaseSystem.getLastSavedBuild(branch)
  const newBuild = await saveBuild(branch)

  if (config.tracker.buildDiffEnabled == true) {
    const channel: TextChannel = await Mizuki.client.channels.fetch(config.tracker.buildDiffChannel) as TextChannel

    if (lastBuild != undefined && newBuild != undefined) {
      await postBuildDiff(newBuild, lastBuild, channel)
    } else if (newBuild != undefined && lastBuild == undefined) {
      const embed = new EmbedBuilder()
      embed.setDescription(`New ${branch} build: ${newBuild.BuildNumber}`)
      embed.setColor(constants.colors.discord_blurple)

      await channel.send({
        content: "New discord build!",
        embeds: [embed]
      })
    }
  }
}

export const SaveBuild: MizukiRoutine = {
  name: "Save latest discord builds",
  run_every: 3600000,
  execute: async (saveCanary?: boolean) => {
    // TODO: figure out if this even works lmao
    try {
      // await getAndSaveBuild("stable", channel)
      if (saveCanary == true || saveCanary == undefined) {
        await getAndSaveBuild("canary")
      }
    } catch (err) {
      Sentry.captureException(err)
      logger.error(`Routine failed: ${err}`)
    }
  }
}
