import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder } from "discord.js";
import { Command } from "../../CommandInterface";

import { JobSystem } from "../../System/JobSystem";

export const ListJobs: Command = {
    name: "listjobs",
    options: [],
    description: "Lists all of the currently running jobs.",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const message = "=== RUNNING JOBS ===\n"

        await Promise.all(JobSystem.ActiveJobs.map(async (job) => {
            console.log(job)
            const index = JobSystem.ActiveJobs.indexOf(job)
            message.concat(`#${job} - ${job.name}\n`)
        }))

        interaction.reply(message)
    }
};