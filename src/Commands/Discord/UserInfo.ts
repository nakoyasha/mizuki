import { Mizuki } from "@system/Mizuki";
import { SlashCommandBuilder, CommandInteraction, SnowflakeUtil, Attachment, AttachmentBuilder } from "discord.js";
import { CommandV2 } from "../../CommandInterface";

import { createCanvas, loadImage } from "canvas"
import { EmbedBuilder } from "@discordjs/builders";
import { constants } from "@util/Constants";

const USER_URL = "https://discord.com/api/users/"

export type User = {
  id: string,
  username: string,
  global_name: string,
  avatar?: string,
  banner?: string,
  avatar_decoration_data?: AvatarDecoration,
  accent_color: number,
  flags: number,
  public_flags: number,
}

export type AvatarDecoration = {
  asset: string,
  sku_id: string,
}

export const UserInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Gets info about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the info of")
        .setRequired(true),
    ),
  deferReply: true,
  contexts: ["user", "guild"],
  run: async (interaction: CommandInteraction) => {
    const user = interaction.options.getUser("user", true);
    const response = await fetch(new URL(user.id, USER_URL), {
      headers: {
        Authorization: `Bot ${Mizuki.secrets.TOKEN}`,
      }
    })

    if (!response.ok) {
      await interaction.followUp(`Failed to fetch user info: ${response.status} - ${response.statusText}`)
      return;
    }

    const userInfo: User = await response.json();
    const snowflakeData = SnowflakeUtil.decode(userInfo.id)
    const hasAvatarDecoration = userInfo.avatar_decoration_data !== null

    // if they have an avatar, get their avatar link
    // if they don't, use the default one!
    const avatarLink = userInfo.avatar !== null ?
      `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=4096` :
      "https://discord.com/assets/ac6f8cf36394c66e7651.png"

    const bannerLink = userInfo.banner != null ? `https://cdn.discordapp.com/banners/${userInfo.id}/${userInfo.banner}.png?size=4096` : "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png"
    const decorationLink = hasAvatarDecoration == true ? `https://cdn.discordapp.com/avatar-decoration-presets/${userInfo?.avatar_decoration_data?.asset}.png?size=4096&passthrough=false` : "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png"

    // if there's an avatar decoration, then downscale their avatar by x1.1
    const heresTheDownScaler = hasAvatarDecoration ? 1.1 : 1

    const avatarImage = await loadImage(avatarLink);
    const canvas = createCanvas(avatarImage.width, avatarImage.height)
    const context = canvas.getContext("2d")

    const widthRatio = context.canvas.width / avatarImage.width / heresTheDownScaler
    const heightRatio = context.canvas.height / avatarImage.height / heresTheDownScaler
    const ratio = Math.min(widthRatio, heightRatio)

    var centerShiftX = (context.canvas.width - avatarImage.width * ratio) / 2;
    var centerShiftY = (context.canvas.height - avatarImage.height * ratio) / 2;

    context.drawImage(avatarImage, 0, 0, avatarImage.width, avatarImage.height, centerShiftX, centerShiftY, avatarImage.width * ratio, avatarImage.height * ratio)

    if (hasAvatarDecoration) {
      const decorationImage = await loadImage(decorationLink)

      const widthRatio = context.canvas.width / decorationImage.width
      const heightRatio = context.canvas.height / decorationImage.height
      const ratio = Math.min(widthRatio, heightRatio)

      var centerShiftX = (context.canvas.width - decorationImage.width * ratio) / 2;
      var centerShiftY = (context.canvas.height - decorationImage.height * ratio) / 2;

      context.drawImage(decorationImage, 0, 0, decorationImage.width, decorationImage.height, centerShiftX, centerShiftY, decorationImage.width * ratio, decorationImage.height * ratio)
    }

    const avatarAttachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "avatar.png",
      description: `${userInfo.global_name}'s avatar`,
    });

    const joinTimestamp = Math.round(Number(snowflakeData.timestamp) / 1000)

    const embed = new EmbedBuilder()
    embed.setColor(constants.colors.discord_blurple)
    embed.setTitle(`User info for ${userInfo.global_name} (${userInfo.username})`)
    embed.setURL(`https://discord.com/users/${userInfo.id}`)

    if (!userInfo.banner == null) {
      embed.setImage(bannerLink)
    }
    embed.setThumbnail("attachment://avatar.png")

    embed.setDescription(`
    **Assets:** [\`Avatar\`](${avatarLink}), [\`Banner\`](${bannerLink}), [\`Decoration\`](${decorationLink})
    **Accent Color:** #${userInfo.accent_color}
    **Flags (to check later):** ${userInfo.flags}
    **Public (to check later):** ${userInfo.flags}
    `)
    embed.addFields([
      {
        name: "Mention",
        value: `<@${userInfo.id}>`,
        inline: true
      },
      {
        name: "Joined discord",
        value: `<t:${joinTimestamp}:R> | on <t:${joinTimestamp}:f>`,
        inline: true,
      },
      {
        name: "ID",
        value: userInfo.id,
        inline: true
      },
    ])


    await interaction.followUp({
      files: [avatarAttachment],
      embeds: [embed]
    })
  }
}