import { constants } from "@util/Constants";
import { SlashCommandBuilder } from "discord.js";
import { CommandV2, RunInteraction } from "src/CommandInterface";

// make a commandv2 command that evaluates javascript
export const Eval: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("MIZUKI-2991 RCE exploit real")
    .addStringOption(option => option
      .setName("code")
      .setDescription("The code to run")
      .setRequired(true)
    ),
  ownerOnly: true,
  run: async function (interaction: RunInteraction) {
    await interaction.deferReply()

    const code = interaction.options.get("code", true)?.value as string
    try {
      const result = eval(code)

      if (result === undefined || result === "") {
        await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
        return;
      }

      await interaction.followUp(result)
    } catch (err: any) {
      if (err.message.includes("Cannot send an empty message")) {
        await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
        return;
      }

      await interaction.followUp(`Exception while running code: \`${err}\``)
    }
  }
}