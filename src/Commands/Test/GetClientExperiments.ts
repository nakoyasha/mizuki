import { getClientExperiments } from "@util/Tracker";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import {
  CommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import { CommandV2 } from "src/CommandInterface";

export const GetClientExperiments: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("get-client-experiments")
    .setDescription("Command for testing whenever my client commands puller works!"),
  deferReply: false,
  ownerOnly: true,
  run: async (interaction: CommandInteraction) => {
    getClientExperiments("puppeteer", DiscordBranch.Stable)
  },
};
