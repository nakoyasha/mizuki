import {
  CommandInteraction,
  AttachmentBuilder,
  SlashCommandBuilder,
} from "discord.js";

import axios from "axios"
import { Agent } from "https"

import { CommandV2 } from "../../CommandInterface";
import Logger from "@system/Logger";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { EmbedBuilder } from "@discordjs/builders";

const logger = new Logger("Commands/DoesItbeat")
const httpsAgent = new Agent({
  maxVersion: "TLSv1.3",
  minVersion: "TLSv1.3"
})

export type WBRAPIData = {
  data: {
    guess_wins: boolean,
    guess_emoji: string,
    reason: string,
    cached: true,
    cache_count: number,
  }
}

async function makeGuess(object: string, guess: string, gid: string) {
  try {
    const response = await axios({
      url: `https://www.whatbeatsrock.com/api/vs`,
      method: "post",
      data: JSON.stringify(({
        prev: object,
        guess: guess,
        gid: crypto.randomUUID(),
      })),
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Priority": "u=0, i",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "upgrade-insecure-requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Electron/30.0.5 Safari/537.36 discord/1.0.26",
      },
      // because axios is annoying
      validateStatus: () => true,
      httpsAgent
    });

    const data = (response.data as WBRAPIData)

    console.log(response.data)
    // if (response.status != 200 && response?.data?.includes("Cloudflare")) {
    //   throw new Error(`The bot has encountered Cloudflare! Cloudflare wins, unfortunately.`)
    // }

    if (response.status != 200) {
      throw new Error(`Encountered an error while contacting the server: ${response.status} (${response.statusText})`)
    }

    if (response.headers["content-type"] != "application/json") {
      console.log(response.headers["content-type"])
      throw new Error("Something has gone very wrong internally while contacting the server! Please try again later!")
    }

    if (data.data.guess_wins != true) {
      throw new Error("Your guess must beat rock first, this is a limitation that I cannot get around.")
    }

    return (response.data as WBRAPIData).data
  } catch (err) {
    throw err;
  }
}

export const DoesItBeat: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("does-it-beat")
    .setDescription("Does object X beat object Y?")
    .addStringOption(option => option
      .setName("does")
      .setDescription("The object that your guess will attempt to beat.")
      .setRequired(true)

    )
    .addStringOption(option => option
      .setName("beat")
      .setDescription("Your guess")
      .setRequired(true)

    ),
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const object = interaction.options.get("does")?.value as string
    const guess = interaction.options.get("beat")?.value as string

    const guid = crypto.randomUUID()

    try {
      if (guess == "rock" && object == "rock") {
        throw new Error("bruh")
      }

      if (object != "rock") {
        await makeGuess("rock", object, guid)
      }

      const data = await makeGuess(object, guess, guid)
      const embed = new EmbedBuilder()

      if (data.guess_wins) {
        embed.setTitle(`✅ ${guess} beats ${object}!`)
      }

      const comboText = data.cached == true ? `${data.cache_count} other people have already tried this..` : `You are the 1st person to beat **${object}** with **${guess}!**`
      embed.setDescription(`${data.reason}\n-# ${comboText}`)

      await interaction.followUp({
        embeds: [embed]
      })
    } catch (err) {
      console.log(`pain ${err}`)
      interaction.followUp({
        embeds: [
          MakeErrorEmbed((err as unknown as Error).message)
        ]
      })
    }

  }
};
