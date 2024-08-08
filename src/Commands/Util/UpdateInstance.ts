import { exec } from "node:child_process"
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";

async function execAsync(process: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(process)
    child.on("exit", () => {
      resolve()
    })
  })
}

export const UpdateInstance: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("update-instance")
    .setDescription("Owner-only: Runs a git pull and restarts the bot.")
  ,
  ownerOnly: true,
  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("pls wait")

    await execAsync("git pull")
    await execAsync("systemctl --user restart mizuki")
  },
};
