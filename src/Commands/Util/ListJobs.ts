import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder } from "discord.js";
import { DownloadFile, tempDir } from "../../Util/DownloadFile";
import { Command } from "../../CommandInterface";

import { spawn } from 'child_process';
import { readFileSync } from "fs";
import { JobSystem } from "../../ServerJobs";

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