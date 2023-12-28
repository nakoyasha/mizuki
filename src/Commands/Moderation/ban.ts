import { ApplicationCommandOptionType, CommandInteraction, Emoji, GuildEmoji, GuildMember, PermissionsBitField, TextBasedChannel } from "discord.js";
import { Command } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder } from "@discordjs/builders";
import Emojis from "../../Maps/EmojisMap";
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
            name: "deletemessagehistory",
            description: "Delete their message history?",
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: "withappeal",
            description: "Should they be able to submit an appeal? (defauls to false)",
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
        const reason = interaction.options.get("reason")?.value as string || "No reason specified"

        if (moderator == offender) {
            await interaction.reply("Are you stupid?");
            return;
        }

        try {
            await offenderMember.ban({
                deleteMessageSeconds: deleteMessageHistory || 0,
                reason: reason
            })

            const embed = new EmbedBuilder()
                .setFooter({
                    text: moderator.username,
                    iconURL: moderator.avatarURL() as string,
                })
                .setDescription(`${offender?.username} was banned by ${moderator.username} for ${reason}`)

            const message = await channel.send({ embeds: [embed] });
            message.react("💀")
        } catch (error) {
            const embed = MakeErrorEmbed(`Failed to ban user: ${error}`)
            await interaction.reply({ embeds: [embed] })
        }
    }
}