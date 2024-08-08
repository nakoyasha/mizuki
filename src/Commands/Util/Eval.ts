import { constants } from "@util/Constants";
import { SlashCommandBuilder } from "discord.js";
import { CommandV2, RunInteraction } from "../../CommandInterface";
import { Mizuki } from "@system/Mizuki";

const BACKTICKS = "```";
const ZWSP = "\u200B";
const codeblock = (s: string, lang = "") => `${BACKTICKS}${lang}\n${s.replaceAll("`", "`" + ZWSP)}${BACKTICKS}`;

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
    let code = interaction.options.get("code", true)?.value as string
    try {
      if (code.includes("await")) code = `(async () => { return ${code} })()`;

      function runCode(): Promise<any> {
        return new Promise(async (resolve, reject) => {
          try {
            //@ts-ignore
            const mizuki = Mizuki;
            const mmtoker = mizuki.secrets.TOKEN
            mizuki.secrets.TOKEN = `Bot ${mizuki.secrets.TOKEN}`
            const result = await eval(code)
            console.log(result)

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

            if (typeof (result) == "object") {
              Mizuki.secrets.TOKEN = mmtoker
              resolve(codeblock(JSON.stringify(result), "json"))
              return;
            }

            Mizuki.secrets.TOKEN = mmtoker
            resolve(result)
          } catch (err) {
            reject(err)
          }
        })
      }

      runCode().then(async (output) => {
        await interaction.followUp(output)
      }).catch(async (err: Error) => {
        if (err.message.includes("Cannot send an empty message")) {
          await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
          return;
        }
        await interaction.followUp(`Error thrown during execution: ${codeblock(err.stack as string, "js")}`)
      })

    } catch (err: any) {

    }
  }
}
