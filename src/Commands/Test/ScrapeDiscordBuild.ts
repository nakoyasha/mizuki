import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "src/CommandInterface";
import { SaveBuild } from "src/Routines/SaveBuild";

export const ScrapeDiscordBuild: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("scrape-discord-build")
    .setDescription("Scrapes the latest discord build"),
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    await new SaveBuild().execute(true, true)
    interaction.reply("yay")
  },
};
