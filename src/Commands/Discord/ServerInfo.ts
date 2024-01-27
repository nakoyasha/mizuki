import { EmbedBuilder } from "@discordjs/builders";
import Logger from "@system/Logger";
import { constants } from "@util/Constants"
import { APIGuildData } from "@mizukiTypes/APIGuildData";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import axios from "axios";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { CommandV2 } from "src/CommandInterface";

const logger = new Logger("Commands/ServerInfo")

const IMAGE_TYPES = {
  "icon": "icons",
  "banner": "banners",
  "splash": "splashes",
}

export const ServerInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("server-info")
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
    const inviteCode = invite
      .replaceAll("https://", "")
      .replaceAll("http://", "")
      .replaceAll("://", "")
      .replaceAll("discord.gg/", "")
      .replaceAll("discord.gg", "")
      .replaceAll(".gg/", "")
      .replaceAll(".gg", "")
    const inviteAPIURL = `https://discord.com/api/invite/${inviteCode}`

    try {
      const data = (await axios.get(inviteAPIURL)).data as APIGuildData

      const isAnimated = data.guild.banner?.startsWith("a_")
      const iconURL = `https://cdn.discordapp.com/${IMAGE_TYPES.icon}/${data.guild.id}/${data.guild.icon}`
      const bannerURL = isAnimated == true &&
        `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}.gif?size=4096` ||
        `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}?size=4096`
      //const splashURL = `https://cdn.discordapp.com/${IMAGE_TYPES.icon}/${data.guild.icon}`

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
        embed.addFields(
          {
            name: "Invite created by",
            value: `${data.inviter?.global_name} (@${data.inviter?.username})`
          }
        )
      }

      interaction.followUp({
        embeds: [embed],
        ephemeral: true,
      })

    } catch (err) {
      logger.error(err as string)
      interaction.followUp({
        embeds: [MakeErrorEmbed(`Failed to retrieve server info: ${err}`)],
        ephemeral: true,
      })
    }
  }
}