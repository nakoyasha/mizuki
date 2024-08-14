import { constants } from "@util/Constants";
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2, RunInteraction } from "../../CommandInterface";
import { Mizuki } from "@system/Mizuki";

const BACKTICKS = "```";
const ZWSP = "\u200B";
const codeblock = (s: string, lang = "") => `${BACKTICKS}${lang}\n${s.replaceAll("`", "`" + ZWSP)}${BACKTICKS}`;

async function sendOutput(output: string, interaction: CommandInteraction) {
  console.log(output.length)
  if (output.length >= 2000) {
    const buffer = Buffer.from(output)
    const attachment = new AttachmentBuilder(buffer, {
      name: "output.json"
    })

    await interaction.followUp({
      content: "Output has been sent in a file due to it exceeding the 2000 character limit.",
      files: [attachment]
    })
    return;
  }

  // if we don't exceed the limit
  await interaction.followUp(output)
}

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

            // environment methods, for use in the eval
            const discordFetch = async (path: string) => {
              const response = await fetch(`https://discord.com/api/${path}`, {
                headers: {
                  Authorization: `Bot ${mizuki.secrets.TOKEN}`
                }
              })

              return await response.json()
            }

            const fetchUrl = async (url: string, headers: Map<any, any>) => {
              const response = await fetch(url, {
                headers: headers as any
              })

              return await response.text()
            }


            const result = await eval(code)

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
              const json = JSON.stringify(result, null, 2)
              const codeblockResult = codeblock(json, "json")

              // avoid codeblocking here as it looks really ugly in a file
              if (codeblockResult.length <= 2000) {
                resolve(codeblock)
              } else {
                resolve(json)
              }

              return;
            }

            resolve(result)
          } catch (err) {
            reject(err)
          }
        })
      }

      runCode().then(async (output: string) => {
        await sendOutput(output, interaction)
      }).catch(async (err: Error) => {
        if (err.message.includes("Cannot send an empty message")) {
          await interaction.followUp(constants.messages.EVAL_CODE_RAN_NO_OUTPUT)
          return;
        }
        await sendOutput(`Error thrown during execution: ${codeblock(err.stack as string, "js")}`, interaction)
      })

    } catch (err: any) {

    }
  }
}
