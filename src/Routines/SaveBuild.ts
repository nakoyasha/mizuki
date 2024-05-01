import type { BuildData } from "@util/Tracker/Types/BuildData";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import type { MizukiRoutine } from "@mizukiTypes/MizukiRoutine";
import { DatabaseSystem } from "@system/DatabaseSystem";
import Logger from "@system/Logger";
import { compileBuildData } from "@util/Tracker/Util/CompileBuildData";

import * as Sentry from "@sentry/node";
import { Mizuki } from "@system/Mizuki";
import { WebhookClient, type TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { constants } from "@util/Constants";

import config from "../../config.json";
import getBranchName from "@util/Tracker/Util/GetBranchName";

const logger = new Logger("Routines/SaveBuild");

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

async function postBuild(
  newBuild: BuildData,
  lastBuild: BuildData,
  channel?: TextChannel,
  webhookUrl?: string,
) {
  const builtOn = Math.round(newBuild.built_on.getTime() / 1000)

  const buildEmbed = new EmbedBuilder()
    .setColor(constants.colors.discord_blurple)
    .setTitle(`New ${getBranchName(newBuild.branches[0])} build`)
    .setDescription(
      `Build number: \`${newBuild.build_number}\`\n` +
      `Build hash: \`${newBuild.build_hash}\`\n` +
      `Build date: <t:${builtOn}:R> | <t:${builtOn}:f>\n` +
      `# Stats\n` +
      ` 🧪 **Experiments**: ${newBuild.counts.experiments}\n` +
      ` 🧵 **Strings**: ${newBuild.counts.strings}\n` +
      `# Changes\n` +
      ` 🧪 **Experiments**:  ${newBuild.diffs.experiments.length} changed\n` +
      ` 🧵 **Strings**: ${newBuild.diffs.strings.length} changed\n\n` +
      `🔗 [\`here's the neller\`](https://nelly.tools/builds/${newBuild.build_hash})\n` +
      `🔗 [\`here's the webber\`](https://shiroko.me/trackers/discord/${newBuild.build_hash})`
    )


  if (channel != undefined) {
    channel.send({
      embeds: [buildEmbed],
    })
  } else if (webhookUrl != undefined) {
    const webhook = new WebhookClient({ url: webhookUrl });
    webhook.send({
      embeds: [buildEmbed],
    })
  }
}

/**
 * @summary Scrapes the current build and saves it to the databaase, so shrimple
 * @param {DiscordBranch} branch - the branch to scrape the current build from
 * @param {boolean} skipCheck - skips checking for if the build has already been saved
 */
async function getAndSaveBuild(branch: DiscordBranch, skipCheck?: boolean) {
  if (skipCheck != true) {
    logger.log("Checking if we already saved the current build..")
    const response = await fetch(DiscordBranch.Canary + "/app")

    if (!response.ok) {
      logger.error(`Fatal error trying to fetch current hash: ${response.status} - ${response.statusText}`)
      return;
    }

    const currentHash = response.headers.get("X-Build-Id") as string
    const isSaved = await DatabaseSystem.getBuildData(currentHash, branch) !== null;

    if (isSaved == true) {
      // we don't need to save it again silly
      return;
    }
  }

  const lastBuild = await DatabaseSystem.getLastBuild(branch);
  const newBuild = await saveBuild(branch);

  const channel: TextChannel = (await Mizuki.client.channels.fetch(
    config.routines.saveBuild.channel,
  )) as TextChannel;

  if (lastBuild !== undefined && newBuild !== undefined) {
    if (lastBuild.build_hash !== newBuild.build_hash) {

      if (config.routines.saveBuild.useWebhook == true) {
        await postBuild(newBuild, lastBuild, undefined, config.routines.saveBuild.webhookUrl);
      } else {
        await postBuild(newBuild, lastBuild, channel);
      }


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


export class SaveBuild implements MizukiRoutine {
  name = "Save latest discord builds";
  // every (x)ms
  run_every = config.routines.saveBuild.runEvery;
  async execute(saveCanary?: boolean, skipCheck?: boolean) {
    if (config.routines.saveBuild.enabled === false && skipCheck != true) {
      return;
    }

    try {
      // await getAndSaveBuild("stable", channel)
      if (saveCanary === true || saveCanary === undefined) {
        await getAndSaveBuild(DiscordBranch.Canary, skipCheck);
      }
    } catch (err) {
      Sentry.captureException(err);
      logger.error(`Routine failed: ${err}`);
    }
  }
}
