import {
  CommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Attachment,
  SlashCommandBuilder,
} from "discord.js";
import { DownloadFile } from "../../Util/DownloadFile";
import { Command, CommandV2 } from "../../CommandInterface";

import { spawn } from "child_process";
import { readFileSync } from "fs";
import { JobResult, JobSystem } from "../../System/JobSystem";
import { Directories } from "../../Maps/DirectoriesMap";

export const VideoToGif: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("videotogif")
    .setDescription("Converts a video to a gif.")
    .addAttachmentOption(option => option
      .setName("video")
      .setDescription("The video to convert")
      .setRequired(true))
    .addIntegerOption(option => option
      .setName("scale")
      .setDescription("The ratio to downscale the video by x,y, -1 to retain aspect ratio on either side")
      .setRequired(true))
    .addIntegerOption(option => option
      .setName("framerate")
      .setDescription("Self-explanatory. The output gif's framerate.")
      .setRequired(true))
    .addIntegerOption(option => option
      .setName("speed")
      .setDescription("Self-explanatory. The output gif's speed.")
      .setRequired(true)),
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const fileName =
      `${interaction.channelId}` +
      interaction.user.id +
      `${interaction.createdTimestamp}.mp4`;
    const outputFile =
      `${interaction.channelId}` +
      interaction.user.id +
      `${interaction.createdTimestamp}.gif`;
    const outputFilePath = Directories.Temp + outputFile;
    const filePath = Directories.Temp + fileName;
    const videoAttachment = interaction.options.get("video")
      ?.attachment as Attachment;
    const scale = interaction.options.get("scale")?.value || "320:-1";
    const fps = interaction.options.get("fps")?.value || "15";
    const speed = interaction.options.get("speed")?.value || "1";

    interaction.reply(
      "Your job has been queued and is awaiting completion. You will be pinged once it's complete (or if there was an arror.)",
    );

    JobSystem.createJob(
      `VideoToGif${fileName}`,
      async () => {
        const ffmpegCommand = [
          "-threads",
          "4",
          "-hwaccel",
          "cuda",
          "-i",
          `${filePath}`,
          "-vf",
          `fps=${fps},scale=${scale}:flags=lanczos,setpts=PTS/${speed},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
          `${outputFilePath}`,
        ];

        await DownloadFile(videoAttachment.proxyURL, filePath);
        const ffmpeg = spawn("ffmpeg", ffmpegCommand);

        ffmpeg.stdout.on("data", (msg) => {
          console.log(msg);
        });

        ffmpeg.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        ffmpeg.on("exit", async () => {
          const output = await readFileSync(outputFilePath);
          (await interaction.fetchReply()).edit({
            content: `<@${interaction.user.id}> Here's your gif!`,
            files: [{ attachment: output, name: "output.gif" }],
          });
        });
      },
      async (result, err) => {
        if (result == JobResult.Failed) {
          (await interaction.fetchReply()).edit({
            content: `<@${interaction.user.id}> Your gif has failed to process: ${err}`,
          });
        }
      },
    );
  },
};
