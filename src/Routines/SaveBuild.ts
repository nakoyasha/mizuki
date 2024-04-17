import type { BuildData } from "@util/Tracker/Types/BuildData";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import type { MizukiRoutine } from "@mizukiTypes/MizukiRoutine";
import { DatabaseSystem } from "@system/DatabaseSystem";
import Logger from "@system/Logger";
import { compileBuildData } from "@util/Tracker/Util/CompileBuildData";

import * as Sentry from "@sentry/node";
import { Mizuki } from "@system/Mizuki";
import { MakeBuildDiffEmbed } from "@commands/Util/MakeBuildDiffEmbed";
import type { TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { constants } from "@util/Constants";

import config from "../../config.json";
import { Octokit } from "octokit";

let octokit: Octokit | undefined = undefined;
const logger = new Logger("Routines/SaveBuild");

export enum SaveMode {
  Discord = "Discord",
  GitHub = "GitHub",
}

async function saveBuild(branch: DiscordBranch) {
  try {
    logger.log(`Compiling current ${branch} build..`);
    const build = (await compileBuildData(branch)) as BuildData;

    logger.log(`Saving build ${build.build_number}`);
    await DatabaseSystem.createBuildData(build, branch);
    logger.log(`Build ${build.build_number} has been saved`);
    return build;
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`Compile failed: ${err}`);
  }
}

async function postBuildDiff(
  NewBuild: BuildData,
  LastBuild: BuildData,
  Channel: TextChannel,
) {
  const buildDiffEmbeds = MakeBuildDiffEmbed(LastBuild, NewBuild);
  const stringEmbeds = buildDiffEmbeds.StringsEmbed;
  const experimentsEmbeds = buildDiffEmbeds.ExperimentsEmbed;

  await Channel.send({
    content: "New discord build!",
    embeds: [],
  });

  for (const embed of stringEmbeds) {
    Channel.send({
      embeds: [embed],
    });
  }

  for (const embed of experimentsEmbeds) {
    Channel.send({
      embeds: [embed],
    });
  }
}

async function getAndSaveBuild(branch: DiscordBranch, SaveType: SaveMode = SaveMode.Discord) {
  const lastBuild = await DatabaseSystem.getLastBuild(branch);
  const newBuild = await saveBuild(branch);

  if (config.tracker.buildDiffEnabled === true) {
    if (SaveType === SaveMode.Discord) {
      const channel: TextChannel = (await Mizuki.client.channels.fetch(
        config.tracker.buildDiffChannel,
      )) as TextChannel;

      // how the hell do the last ones even happen... biome what are you doing ??
      if (lastBuild !== undefined && newBuild !== undefined && lastBuild !== null && newBuild !== null) {
        if (lastBuild.build_hash !== newBuild.build_hash) {
          await postBuildDiff(newBuild, lastBuild, channel);
        }
      } else if (newBuild !== undefined && lastBuild === undefined) {
        const embed = new EmbedBuilder();
        embed.setDescription(`New ${branch} build: ${newBuild.build_number}`);
        embed.setColor(constants.colors.discord_blurple);

        await channel.send({
          content: "New discord build!",
          embeds: [embed],
        });
      }
    }
  }
}


export class SaveBuild implements MizukiRoutine {
  name = "Save latest discord builds";
  run_every = 900000;
  async execute(saveCanary?: boolean) {
    try {
      // await getAndSaveBuild("stable", channel)
      if (saveCanary === true || saveCanary === undefined) {
        await getAndSaveBuild(DiscordBranch.Canary, SaveMode.GitHub);
      }
    } catch (err) {
      Sentry.captureException(err);
      logger.error(`Routine failed: ${err}`);
    }
  }
}
