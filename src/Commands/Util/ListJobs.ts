import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder, EmbedBuilder, EmbedField } from "discord.js";
import { Command } from "../../CommandInterface";

import { JobStatus, JobSystem } from "../../System/JobSystem";

export const ListJobs: Command = {
    name: "listjobs",
    options: [],
    description: "Lists all of the currently running jobs.",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    ownerOnly: true,
    run: async (interaction: CommandInteraction) => {
        const embed = new EmbedBuilder()
        const fields = [] as EmbedField[]
        embed.setColor(0xFFFFFF)
        embed.setTitle(`Active bot jobs (GLOBAL)`)

        for await (const job of JobSystem.ActiveJobs) {
            var jobStatus = "Idle"

            switch (job.status) {
                case JobStatus.Failed:
                    jobStatus = "Failed"
                    break;
                case JobStatus.Running:
                    jobStatus = "Running"
                    break;
                default:
                    jobStatus = "Idle"
                    break;
            }

            fields.push({
                name: `${job.name}`,
                value: `${jobStatus}`,
                inline: true,
            })
        };

        embed.setFields(fields)

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    }
};