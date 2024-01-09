import { ApplicationCommandOptionType, SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";
import axios from "axios";

const badBadBadCodes = [500, 501, 502, 503, 504];

export const IsItFucked: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("is-it-fucked")
    .setDescription("Checks if a website is down or not.")
    .addStringOption(option => option
      .setName("url")
      .setDescription("The website to check")
      .setRequired(true)
    ),
  run: async (interaction: CommandInteraction) => {
    let endpoint = interaction.options.get("url", true)?.value as string;

    // /await interaction.deferReply()

    // strip it of the url
    endpoint = endpoint.replaceAll("https://", "");
    endpoint = endpoint.replaceAll("http://", "");
    const data = await axios({
      method: "GET",
      url: "https://" + endpoint,
      validateStatus: () => true,
    });
    const isBadCode = badBadBadCodes.find((code) => {
      if (code == data.status) {
        return code;
      }
    });

    // if its not a bad code
    if (isBadCode == undefined) {
      await interaction.followUp({
        content: "its not fucked 👍",
      });
    } else {
      await interaction.followUp({
        content: "its fucked 👍 HTTP Code: " + data.status,
      });
    }
  },
};
