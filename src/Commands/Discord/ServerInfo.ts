import { EmbedBuilder } from "@discordjs/builders";
import Logger from "@system/Logger";
import { constants } from "@util/Constants"
import { APIGuildData } from "@mizukiTypes/APIGuildData";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import axios from "axios";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { CommandV2 } from "../../CommandInterface";
import * as Sentry from "@sentry/node"

const logger = new Logger("Commands/ServerInfo")

const IMAGE_TYPES = {
  "icon": "icons",
  "banner": "banners",
  "splash": "splashes",
}

export const ServerInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("inviteinfo")
    .setDescription("Displays info about a server via it's invite link")
    .addStringOption(option => option
      .setName("invite")
      .setDescription("The invite link to the server")
      .setRequired(true)
    )
  ,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const invite = interaction.options.get("invite")?.value as string
    if (
      invite
        .replaceAll("https://", "")
        .replaceAll("http://", "")
        .replaceAll("://", "")
        .startsWith("discord.gg") != true
    ) {

    }

    const inviteCode = invite
      .replaceAll("https://", "")
      .replaceAll("http://", "")
      .replaceAll("://", "")
      .replaceAll("discord.gg/", "")
      .replaceAll("discord.gg", "")
      .replaceAll(".gg/", "")
      .replaceAll(".gg", "")
    const inviteAPIURL = `https://discord.com/api/invite/${inviteCode}`

    const response = await fetch(inviteAPIURL)

    if (!response.ok) {
      logger.error(`Failed to retrieve info for ${inviteCode} - ${response.status}`)
      interaction.followUp({
        embeds: [MakeErrorEmbed(`Failed to retrieve server info: ${response.statusText}`)],
        ephemeral: true,
      })
    }

    const data = await response.json() as APIGuildData

    const isAnimated = data.guild.banner?.startsWith("a_")
    const iconURL = `https://cdn.discordapp.com/${IMAGE_TYPES.icon}/${data.guild.id}/${data.guild.icon}`
    const bannerURL = isAnimated == true &&
      `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}.gif?size=4096` ||
      `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}?size=4096`
    const hasInviter = data?.inviter != undefined

    const embed = new EmbedBuilder()
    embed.setColor(constants.colors.discord_blurple)
    embed.setTitle(`Server Info for ${data.guild.name}`)
    embed.setThumbnail(iconURL)
    // TODO: apply the same crop that discord does
    embed.setImage(bannerURL)

    embed.addFields(
      {
        name: "Default Channel",
        value: data.channel.name,
        inline: true,
      },
      {
        name: "Server ID",
        value: data.guild.id,
        inline: true,
      },
      {
        name: "NSFW",
        value: data.guild.nsfw && "Yes" || "No",
        inline: true,
      },
    )


    if (hasInviter == true) {
      // global_name is null if it's equal to the username(?)
      const inviterGlobalName = data.inviter?.global_name
      const inviterUssername = data.inviter?.username

      if (inviterGlobalName != inviterUssername && inviterGlobalName != null) {
        embed.addFields(
          {
            name: "Invite created by",
            value: `${inviterGlobalName} (<@${data.inviter?.id}>)`,
            inline: false,
          }
        )
      } else {
        embed.addFields(
          {
            name: "Invite created by",
            value: `<@${data.inviter?.id}>`,
            inline: false,
          }
        )
      }
    }

    // Features pass
    const features = []
    for (let feature of data.guild.features) {
      const formattedFeature = constants.formatted_server_features.get(feature)

      if (formattedFeature != null) {
        logger.log(`Found feature: ${feature} - ${formattedFeature}`)
        features.push(formattedFeature)
      } else {
        logger.warn(`Unrecognized feature: ${feature}`)
      }
    }

    // Taken from https://gitdab.com/Cynosphere/HiddenPhox/src/commit/adf80c3f1ac8608799a2d39f77b3b5f1ff327c14/src/modules/utility/guildinfo.js
    // Left side of features
    embed.addFields({
      name: `Features (${features.length} out of ${data.guild.features.length} recognized)`,
      value: features.length > 0 ? features.slice(0, Math.ceil(features.length / 2)).join("\n") : "None",
      inline: true
    })

    // Right side of features
    embed.addFields({
      name: "\u200b",
      value: features.slice(Math.ceil(features.length / 2), features.length).join("\n"),
      inline: true,
    })

    interaction.followUp({
      embeds: [embed],
      ephemeral: true,
    })
  }
}