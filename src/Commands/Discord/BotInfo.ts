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
import axios from "axios";
import * as Sentry from "@sentry/node"
import hash from "~git-hash"

function formatDuration(sec_num: number) {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;

  return hours + ":" + minutes + ":" + seconds;
}

const BotInfoLogger = new Logger("BotInfo");


export const BotInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Shows info/stats about the bot.")
  ,
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
      const response = await axios.get(
        "https://api.github.com/repos/nakoyasha/mizuki",
      );

      if (response.status === 200) {
        githubStarCount = response.data.stargazers_count;
      } else {
        throw new Error(
          `Failed to get repository information. Status code: ${response.status}`,
        );
      }
    } catch (err) {
      Sentry.captureException(err)
      BotInfoLogger.log(`Failed to get GitHub Stars: ${err}`);
    }

    // get github contributors
    try {
      const response = await axios.get(
        "https://api.github.com/repos/nakoyasha/mizuki/contributors",
      );

      if (response.status === 200) {
        githubContributors = response.data.map(
          (contributor: { login: string }) => contributor.login,
        );
      } else {
        throw new Error(
          `Failed to get repository information. Status code: ${response.status}`,
        );
      }
    } catch (err) {
      Sentry.captureException(err)
      BotInfoLogger.log(`Failed to get GitHub Contributors: ${err}`);
    }

    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Mizuki Stats")
      .setDescription(
        "Bot created by <@222069018507345921> for fun!\n" +
        `Commit ${hash}` +
        "\nIncludes features useful for server owners, players of a specific gacha game, and for people who want to make silly gifs.\n" +
        `**:star: Stars:** ${githubStarCount}\n` +
        `**${Emojis.steamhappy} Total Contributors:** ${githubContributors.length}` +
        "\n\nPlease check out the [original repo!](https://github.com/nakoyasha/mizuki)",
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
        { name: "Uptime", value: uptimeString, inline: true },
      );
    interaction.reply({ embeds: [embed] });
  },
};
