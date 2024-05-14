import { ApplicationCommandOptionType } from "discord.js";
import { Commands, RunInteraction, defineCommand } from "src/CommandInterface";

export default defineCommand({
  name: "whois",
  description: "Performs a WHOIS lookup on a domain.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "domain",
      description: "The domain to perform the LOOKUP on",
    }
  ],
  run: function (interaction: RunInteraction): void {
    interaction.reply("yay!")
  }
})

console.log(Commands)