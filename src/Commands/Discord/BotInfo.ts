import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";

import os from "os";
import { Mizuki } from "@system/Mizuki";
import Logger from "@system/Logger";
import { Emojis } from "@maps/EmojisMap";
import * as Sentry from "@sentry/node";
import hash from "~git-hash";
import buildDate from "~build-time";

function formatDuration(sec_num: number) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  let hours_string = "";
  let minutes_string = "";
  let seconds_string = "";

  if (hours < 10) {
    hours_string = "0" + hours;
  }
  if (minutes < 10) {
    minutes_string = "0" + minutes;
  }
  if (seconds < 10) {
    seconds_string = "0" + seconds;
  }
  var time = hours_string + ":" + minutes_string + ":" + seconds_string;
  return time;
}

const BotInfoLogger = new Logger("BotInfo");

export const BotInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Shows info/stats about the bot."),
  deferReply: false,
  ownerOnly: false,
  run: async (interaction: CommandInteraction) => {
    const cores = os.cpus();
    const cpu = cores[0];
    const serverCount = Mizuki.client.guilds.cache.size;

    const uptimeString = formatDuration(Math.floor(process.uptime()));
    let githubStarCount = 0,
      githubContributors: string[] = [];

    // try and get github stars
    try {
      const response = await fetch(
        "https://api.github.com/repos/nakoyasha/mizuki"
      );

      if (response.ok) {
        const data = await response.json();

        githubStarCount = data.stargazers_count;
      } else {
        throw new Error(
          `Failed to get repository information. Status code: ${response.status}`
        );
      }
    } catch (err) {
      Sentry.captureException(err);
      BotInfoLogger.log(`Failed to get GitHub Stars: ${err}`);
    }

    // get github contributors
    try {
      const response = await fetch(
        "https://api.github.com/repos/nakoyasha/mizuki/contributors"
      );

      if (response.ok) {
        const data = await response.json();

        githubContributors = data.map(
          (contributor: { login: string }) => contributor.login
        );
      } else {
        throw new Error(
          `Failed to get repository information. Status code: ${response.status}`
        );
      }
    } catch (err) {
      Sentry.captureException(err);
      BotInfoLogger.log(`Failed to get GitHub Contributors: ${err}`);
    }

    // janky hack, somehow the date we get from esbuild
    // is a broken date.
    const theRealBuildDate = new Date(buildDate);

    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Mizuki Stats")
      .setDescription(
        "Bot created by <@222069018507345921> for fun!\n" +
          `Running commit ${hash}, built on ${theRealBuildDate.toDateString()} at ${theRealBuildDate
            .toTimeString()
            // we only need the time, not the timezone.
            .substring(0, 8)}` +
          "\nIncludes features useful for server owners, players of a specific gacha game, and for people who want to make silly gifs.\n" +
          `**:star: Stars:** ${githubStarCount}\n` +
          `**${Emojis.blobcatcozy} Total Contributors:** ${githubContributors.length}` +
          "\n\nPlease check out the [original repo!](https://github.com/nakoyasha/mizuki)"
      )
      .addFields(
        {
          name: "Bot Instance Owner",
          value: `<@${Mizuki.instanceInfo.id}> (${Mizuki.instanceInfo.username})`,
          inline: true,
        },
        {
          name: "Running on",
          value: `${os.type()} ` + os.release(),
          inline: true,
        },
        { name: "CPU", value: cpu.model, inline: true },
        { name: "Serving", value: `${serverCount} servers`, inline: true },
        { name: "Uptime", value: uptimeString, inline: true }
      );
    interaction.reply({ embeds: [embed] });
  },
};
