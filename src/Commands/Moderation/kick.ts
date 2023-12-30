import { ApplicationCommandOptionType, CommandInteraction, GuildMember, PermissionsBitField, TextBasedChannel } from "discord.js";
import { Command } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

export const kick: Command = {
    name: "kick",
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
            name: "quiet",
            description: "If enabled, the offender will not receive a DM from the bot telling them about their kick.",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],
    description: "Ban a user (and shame them too!)",
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const channel = await interaction.guild?.channels.fetch(channels.shameCorner) as TextBasedChannel
        const moderator = interaction.user
        const offender = interaction.options.getUser("user")
        const offenderMember = interaction.guild?.members.cache.get(offender?.id as string) as GuildMember
        const kickReason = interaction.options.get("reason")?.value as string || "No reason specified"
        const shouldDM = interaction.options.get("quiet")?.value as boolean

        if (moderator == offender) {
            await interaction.reply("Are you stupid?");
            return;
        }

        try {
            if (shouldDM == true) {
                await offenderMember.send(`You have been kicked from ${interaction.guild?.name} by ${moderator.username} for ${kickReason}`)
            }
            await offenderMember.kick(kickReason)

            const embed = new EmbedBuilder()
                .setFooter({
                    text: moderator.username,
                    iconURL: moderator.avatarURL() as string,
                })
                .setDescription(`${offender?.username} was kicked by ${moderator.username} for ${kickReason}`)

            const message = await channel.send({ embeds: [embed] });
            message.react("💀")

            await interaction.reply({
                content: `Successfully kicked ${offender?.username}. They have been DM'd about the kick.`,
                ephemeral: true,
            })
        } catch (error) {
            const embed = MakeErrorEmbed(`Failed to kick user: ${error}`)
            await interaction.reply({ embeds: [embed] })
        }
    }
}