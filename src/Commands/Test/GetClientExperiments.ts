import { getClientExperiments } from "@util/PullExperimentData";
import { CommandInteraction, ApplicationCommandType, Guild, SlashCommandBuilder } from "discord.js";
import { Command, CommandV2 } from "src/CommandInterface";
import GuildCreate from "src/Listeners/GuildCreate";

export const GetClientExperiments: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("get-client-experiments")
    .setDescription("ya"),
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    getClientExperiments("puppeteer", "stable")
  },
};
