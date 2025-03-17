import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import Emojis from "@maps/EmojisMap";
import { Mizuki } from "@system/Mizuki";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { AttachmentBuilder, ButtonStyle, GuildMember, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "src/CommandInterface";

export const CacheUser: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("cacheuser")
    .setDescription("Caches a user so that they would appear correctly instead of as @invalid-user")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to cache")
      .setRequired(true)
    ),
  deferReply: false,
  run: async function (interaction) {
    await interaction.deferReply()
    const user = await interaction.options.getUser("user")
    const member = await interaction.guild?.members.cache.get(user?.id as string)

    if (user === null) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't cache a user that doesn't exist ${Emojis.blobcatcozy}`)
        ]
      })
      return
    }

    const botMember = interaction.guild?.members.cache.find((member) => member.id == Mizuki.client.user?.id)

    // ...why would you do this?
    if (user.id == botMember?.id) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't moderate myself, sorry!! ${Emojis.blobcatcozy}`)
        ]
      })
      return;
    }

    if (!botMember?.permissions.has("BanMembers") || !botMember?.permissions.has("KickMembers")) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't moderate this user as I lack the \"Ban Members\" or the \"Kick Members\" permission.\nPlease grant me those permissions before using the moderate command ${Emojis.blobcatcozy}`)
        ],
        files: [
          new AttachmentBuilder("assets/errors/no_moderate_perms.png"),
        ]
      })
      return;
    }

    if (member !== undefined) {
      // check if the bot can ban/kick
      if (!member.bannable || !member.kickable) {
        await interaction.followUp({
          embeds: [
            MakeErrorEmbed(`I can't moderate this user as they have a higher role ${Emojis.blobcatcozy}`)
          ]
        })
        return;
      }
    }

    const confirmButton = new ButtonBuilder()
      .setCustomId(`cache-user-confirm-${user?.id}`)
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger)

    const actionRow = new ActionRowBuilder()
      .addComponents(confirmButton)

    await interaction.followUp({
      content: `**CAUTION:** This command will ban the user in an attempt to cache them. This is unnecessary for server members as they should already be cached!
**Dismiss this message to cancel!**
`,
      ephemeral: true,
      // make ts not complain about it >:c
      components: [actionRow as any]
    })

  },
}