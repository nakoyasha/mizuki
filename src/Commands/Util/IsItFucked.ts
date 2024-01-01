import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "../../CommandInterface";
import axios from "axios";

const badBadBadCodes = [500, 501, 502, 503, 504];

export const IsItFucked: Command = {
  name: "is-it-fucked",
  options: [
    {
      name: "api",
      description: "The API endpoint to check.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  description: "Checks if an API endpoint responds properly.",
  run: async (interaction: CommandInteraction) => {
    let endpoint = interaction.options.get("api", true)?.value as string;

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
