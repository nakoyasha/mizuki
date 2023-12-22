import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from "discord.js";
import { Command } from "../../CommandInterface";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

export const Purge: Command = {
    name: "purge",
    options: [
        {
            name: "amount",
            description: "Amount of messages to purge",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    description: "purge the current channel.",
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const amount = interaction.options.get("amount")?.value as number
        try {
            const channel = interaction.channel as TextChannel
            const messages = await channel.bulkDelete(amount, true)

            interaction.reply(`Deleted ${messages.size}`)
        } catch (error) {
            const embed = MakeErrorEmbed(`Failed to purge: ${error}`)
            await interaction.reply({ embeds: [embed] })
        }
    }
}