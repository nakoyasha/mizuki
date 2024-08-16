import {
  CommandInteraction,
  AttachmentBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { CommandV2 } from "../../CommandInterface";
import Logger from "@system/Logger";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { EmbedBuilder } from "@discordjs/builders";

const logger = new Logger("Commands/DoesItbeat")

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
  const response = await fetch("https://www.whatbeatsrock.com/api/vs", {
    headers: {
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9,uk-UA;q=0.8,uk;q=0.7,zh;q=0.6",
      "Content-Type": "application/json",
      "Priority": "u=1, i",
      "Sec-Ch-Ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": "\"Windows\"",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "Dnt": "1",
      "Origin": "https://www.whatbeatsrock.com/",
      "Referrer": "https://www.whatbeatsrock.com/",
      "ReferrerPolicy": "strict-origin-when-cross-origin",
    },
    body: JSON.stringify({
      prev: object,
      guess: guess,
      gid: gid,
    }),
    method: "POST",
  });

  if (!response.ok && (await response.text()).includes("Cloudflare")) {
    throw new Error(`The bot has encountered Cloudflare! Cloudflare wins, unfortunately.`)
  }

  if (!response.ok) {
    logger.log(await response.text())
    throw new Error(`Encountered an error while contacting the server: ${response.status} (${response.statusText})`)
  }

  if (response.headers.get("content-type") != "application/json") {
    throw new Error("Something has gone very wrong internally while contacting the server! Please try again later!")
  }

  const data = await response.json() as WBRAPIData

  if (data.data.guess_wins != true) {
    throw new Error("Your guess must beat rock first, this is a limitation that I cannot get around.")
  }

  return data.data
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
      await makeGuess("rock", object, guid)

      console.log("got past initial guess!")
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
