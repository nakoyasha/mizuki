import { ButtonBuilder, ApplicationCommandOptionType, CommandInteraction, Emoji, GuildEmoji, GuildMember, PermissionsBitField, TextBasedChannel, ButtonStyle, ActionRowBuilder, ButtonComponent } from "discord.js";
import { Command } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

export const ban: Command = {
    name: "ban",
    permissions: [PermissionsBitField.Flags.BanMembers],
    options: [
        {
            name: "user",
            description: "The user to ban.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "For what reason should they be banned",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "deleteMessageHistory",
            description: "Delete their message history?",
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: "withAppeal",
            description: "Should they be able to submit an appeal? (defauls to false)",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
        {
            name: "quiet",
            description: "If enabled, the offender will not receive a DM from the bot telling them about their ban.",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],
    description: "Ban a user (and shame them too!)",
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const channel = await interaction.guild?.channels.fetch(channels.shameCorner) as TextBasedChannel
        const moderator = interaction.user
        const deleteMessageHistory = interaction.options.get("deleteMessageHistory")?.value as number
        const offender = interaction.options.getUser("user")
        const offenderMember = interaction.guild?.members.cache.get(offender?.id as string) as GuildMember
        const banReason = interaction.options.get("reason")?.value as string || "No reason specified"
        const shouldDM = interaction.options.get("quiet")?.value as boolean


        if (moderator == offender) {
            await interaction.reply("Are you stupid?");
            return;
        }

        try {
            if (shouldDM == true) {
                await offenderMember.send(`You have been banned from ${interaction.guild?.name} by ${moderator.username} for ${banReason}`)
            }
            await offenderMember.ban({
                deleteMessageSeconds: deleteMessageHistory || 0,
                reason: banReason
            })

            const embed = new EmbedBuilder()
                .setFooter({
                    text: moderator.username,
                    iconURL: moderator.avatarURL() as string,
                })
                .setDescription(`${offender?.username} was banned by ${moderator.username} for ${banReason}`)

            const message = await channel.send({ embeds: [embed] });
            message.react("💀")

            const unbanButton = new ButtonBuilder()
                .setCustomId(`unban${offender?.id}`)
                .setLabel("Unban user")
                .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(unbanButton);

            await interaction.reply({
                content: `Successfully banned ${offender?.username}. They have been DM'd about the ban.`,
                components: [row],
                ephemeral: true,
            })
        } catch (error) {
            const embed = MakeErrorEmbed(`Failed to ban user: ${error}`)
            await interaction.reply({ embeds: [embed] })
        }
    }
}