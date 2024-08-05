import { EmbedBuilder } from "@discordjs/builders";
import Logger from "@system/Logger";
import { constants } from "@util/Constants"
import { APIGuildData, INVITE_TYPE } from "@mizukiTypes/APIGuildData";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { CommandV2 } from "../../CommandInterface";
const logger = new Logger("Commands/ServerInfo")

const IMAGE_TYPES = {
  "icon": "icons",
  "banner": "banners",
  "splash": "splashes",
}

const VERIFICATION_LEVELS = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Highest",
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
      // remove the force prefix
      .replaceAll("!", "")
      .replaceAll(".gg", "")

    const redirect = invite.includes("!") != true ? constants.server_redirects.get(inviteCode) : undefined
    const inviteAPIURL = `https://discord.com/api/invite/${redirect != undefined ? redirect : inviteCode}`

    const response = await fetch(inviteAPIURL)

    if (!response.ok) {
      logger.error(`Failed to retrieve info for ${inviteCode} - ${response.status}`)
      interaction.followUp({
        embeds: [MakeErrorEmbed(`Failed to retrieve server info: ${response.statusText}`)],
        ephemeral: true,
      })
      return;
    }

    const data = await response.json() as APIGuildData

    if (data.type != INVITE_TYPE.SERVER) {
      interaction.followUp({
        embeds: [MakeErrorEmbed("GDM and friend invites are not supported.")]
      })
      return;
    }

    const isBannerAnimated = data.guild.banner?.startsWith("a_")
    const iconURL = `https://cdn.discordapp.com/${IMAGE_TYPES.icon}/${data.guild.id}/${data.guild.icon}`
    const bannerURL = isBannerAnimated == true &&
      `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}.gif?size=4096` ||
      `https://cdn.discordapp.com/${IMAGE_TYPES.banner}/${data.guild.id}/${data.guild.banner}?size=4096`
    const splashURL = `https://cdn.discordapp.com/${IMAGE_TYPES.splash}/${data.guild.id}/${data.guild.splash}?size=4096`
    const hasInviter = data?.inviter != undefined
    const description = []

    if (redirect != undefined) {
      description.push(`\n:warning: You were **redirected** from \`${inviteCode}\` to \`${redirect}\` as the former is either a stolen vanity or a fake server. Prefix with **!** to bypass this.\n`)
    }

    description.push("[\`Join Server\`](https://discord.gg/${inviteCode})")

    if (data.guild.icon != null) {
      description.push(`[\`Banner\`](${bannerURL})`)
    }

    if (data.guild.banner != null) {
      description.push(`[\`Icon\`](${iconURL})`)
    }

    if (data.guild.splash != null) {
      description.push(`[\`Splash\`](${splashURL})`)
    }

    if (data.guild.description != null) {
      description.push(`\n${data.guild.description}`)
    }

    const embed = new EmbedBuilder()
    embed.setColor(constants.colors.discord_blurple)
    // Show a checkmark if the server is verified
    embed.setTitle(`${data.guild.features.includes("VERIFIED") ? ":white_check_mark: " : ""} Server Info for ${data.guild.name}`)
    embed.setThumbnail(iconURL)
    // TODO: apply the same crop that discord does
    embed.setImage(bannerURL)

    embed.setDescription(description.join(" "))

    // Inviter pass
    if (hasInviter == true) {
      // global_name is null if it's equal to the username(?)
      const inviterGlobalName = data.inviter?.global_name
      const inviterUssername = data.inviter?.username

      if (inviterGlobalName != inviterUssername && inviterGlobalName != null) {
        embed.addFields(
          {
            name: "Invite created by",
            value: `**${inviterGlobalName}** (<@${data.inviter?.id}>)`,
            inline: true,
          }
        )
      } else {
        embed.addFields(
          {
            name: "Invite created by",
            value: `**@${inviterUssername}** (<@${data.inviter?.id}>)`,
            inline: true,
          }
        )
      }
    } else {
      // For vanity URLs, since it looks cooler xd
      embed.addFields(
        {
          name: "Invite created by",
          value: `**Discord** (<@643945264868098049>)`,
          inline: true,
        }
      )
    }

    // Basic server info pass
    embed.addFields(
      {
        name: "Default Channel",
        value: `#${data.channel.name} (${data.channel.id})`,
        inline: true,
      },
      {
        name: "Server ID",
        value: data.guild.id,
        inline: true,
      },
      {
        name: "Verification Level",
        value: VERIFICATION_LEVELS[data.guild.verification_level],
        inline: true,
      },
      {
        name: "NSFW",
        value: data.guild.nsfw && "Yes" || "No",
        inline: true,
      },
      data.expires_at != null ? {
        name: "Invite TTL",
        value: data.expires_at,
      } : {
        name: "\u200b",
        value: "\u200b",
      }
    )

    // Features pass
    let features = []
    for (let feature of data.guild.features) {
      const formattedFeature = constants.formatted_server_features.get(feature)

      if (formattedFeature != null) {
        logger.log(`Found feature: ${feature} - ${formattedFeature.text}`)
        features.push(formattedFeature.deprecated == true ? `~~${formattedFeature.text}~~` : formattedFeature.text)
      } else {
        logger.warn(`Unrecognized feature: ${feature}`)
      }
    }

    features = features.sort()

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