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
      const filteredCode = code
        .replaceAll("TOKEN", "meow")

      async function reportError(err: Error) {
        console.warn(`Exception while running eval ${err.message}\n${err.cause}`)
        await interaction.followUp(`Exception while running code: ${err.message}\nCause:${err.cause}`)
      }

      function runCode(): Promise<any> {
        return new Promise(async (resolve, reject) => {
          try {
            //@ts-ignore
            const mizuki = Mizuki;
            const result = await (await eval(`async () => ${filteredCode}`))()
            if (result === undefined || result === "") {
              reject(new Error("Function returned no code"))
              return;
            }
            if (result === process.env.TOKEN) {
              reject(new Error("Output contains the bot's token"))
              return;
            }

            if ((result.toString() as string).includes(Mizuki.secrets.TOKEN)) {
              reject(new Error("Output contains the bot's token"))
              return;
            }

            resolve(result)
          } catch (err) {
            reject(err)
          }
        })
      }

      runCode().then(async (output) => {
        await interaction.followUp(output)
      }).catch(async (err: Error) => {
        await interaction.followUp(`Error thrown during execution: ${err.message}`)
      })

    } catch (err: any) {
      if (err.message.includes("Cannot send an empty message")) {
        await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
        return;
      }
    }
  }
}
