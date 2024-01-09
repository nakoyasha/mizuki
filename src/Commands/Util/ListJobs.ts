import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  EmbedField,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";

import { JobStatus, JobSystem } from "../../System/JobSystem";

export const ListJobs: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("list-jobs")
    .setDescription("Lists all of the jobs the bot is working on."),
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    const embed = new EmbedBuilder();
    const fields = [] as EmbedField[];
    embed.setColor(0xffffff);
    embed.setTitle("Active bot jobs (GLOBAL)");

    for await (const job of JobSystem.ActiveJobs) {
      let jobStatus = "Idle";

      switch (job.status) {
        case JobStatus.Failed:
          jobStatus = "Failed";
          break;
        case JobStatus.Running:
          jobStatus = "Running";
          break;
        default:
          jobStatus = "Idle";
          break;
      }

      fields.push({
        name: `${job.name}`,
        value: `${jobStatus}`,
        inline: true,
      });
    }

    embed.setFields(fields);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
