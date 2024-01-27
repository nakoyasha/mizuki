import Logger from "@system/Logger";
import axios from "axios";
import parse from "node-html-parser";

import acorn from "acorn"
import walk from "acorn-walk"

const logger = new Logger("pullClientScripts")
const DISCORD_URL = "https://discord.com";
const PTB_DISCORD_URL = "https://ptb.discord.com";
const CANARY_DISCORD_URL = "https://canary.discord.com";

export async function getScript(name: string) {
  return await axios(DISCORD_URL + "/app")
}

export async function pullClientScripts() {
  // very janky way to get the scripts.
  // ohwell :airicry:
  logger.log("Getting initial scripts");
  const initialDOM = await axios(DISCORD_URL + "/app")
  const data = (initialDOM.data as string)
  const dom = parse(data)
  const scriptElements = dom.getElementsByTagName("script")

  const initialScripts: string[] = []
  const scripts: { [key: string]: string } = {}

  for (let script of scriptElements) {
    const src = script.getAttribute("src")

    if (!src?.endsWith(".js")) {
      continue;
    }
    initialScripts.push(script.getAttribute("src") as string)
  }

  logger.log(`Got ${initialScripts.length} initial scripts`);
  logger.log(`Getting every script from the lazy-loaded list. This may take a while!`)

  for (let initialScript of initialScripts) {
    const file = (await axios(DISCORD_URL + initialScript)).data
    const parsed = acorn.parse(file, { ecmaVersion: 10 })

    walk.ancestor(parsed, {
      async Literal(node, _, ancestors) {
        // TODO: this is janky. very janky. make it less janky :cr_hUh:
        const value = node.value
        const ancestor = ancestors[ancestors.length - 3]

        if (typeof value === "string" && ancestor.type == "ObjectExpression") {
          if (value.startsWith("lib/") || value.startsWith("istanbul") || value.startsWith("src")) {
            return;
          }

          if ((value as string).endsWith(".js")) {
            const content = (await axios(DISCORD_URL + "/assets/" + value)).data
            scripts[value] = content
          }
        }
      }
    })
  }

  logger.log(`Got ${scripts.length} total scripts`);
  return Object.entries(scripts)
}