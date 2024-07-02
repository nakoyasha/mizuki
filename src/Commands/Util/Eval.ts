import { constants } from "@util/Constants";
import { SlashCommandBuilder } from "discord.js";
import { CommandV2, RunInteraction } from "../../CommandInterface";
import { Mizuki } from "@system/Mizuki";

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
      let hadAnError = false;
      const filteredCode = code
        // .replaceAll("interaction", "null")
        // .replaceAll("console.log", "output.push")
        // .replaceAll("console.warn", "output.push")
        // .replaceAll("console.error", "output.push")
        .replaceAll("TOKEN", "meow")

      async function reportError(err: Error) {
        hadAnError = true;
        await interaction.followUp(`Exception while running code: ${err.message}\nCause:${err.cause}`)
      }

      const result = eval(`
        (async () => {
          try {
            ${filteredCode}
          } catch (err) {
           await reportError(err)
          }
        })()
        `)

      if (result === undefined || result === "") {
        await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
        return;
      }

      // incase someone still somehow gets the token
      if (result === process.env.TOKEN) {
        await interaction.followUp(
          constants.messages
            .EVAL_CODE_USER_TRIED_TO_SEND_THE_BOT_TOKEN_BUT_WE_WONT_LET_THEM_DO_THAT_BECAUSE_OH_GOD_THAT_IS_BAD_VERY_VERY_VERY_BAD
        )
        return;
      }

      if ((result.toString() as string).includes(Mizuki.secrets.TOKEN)) {
        await interaction.followUp(
          constants.messages
            .EVAL_CODE_USER_TRIED_TO_SEND_THE_BOT_TOKEN_BUT_WE_WONT_LET_THEM_DO_THAT_BECAUSE_OH_GOD_THAT_IS_BAD_VERY_VERY_VERY_BAD
        )
        return;
      }

      // safe tostring (hopefully??)
      // NOTE: make it actually safe if it isn't
      if (!hadAnError) {
        await interaction.followUp(`${result}`)
      }
    } catch (err: any) {
      if (err.message.includes("Cannot send an empty message")) {
        await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
        return;
      }

      await interaction.followUp(`Exception while running code: \`\`\`diff\n-${err}\n\`\`\` `)
    }
  }
}
