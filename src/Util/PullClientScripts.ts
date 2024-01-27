import Logger from "@system/Logger";
import axios from "axios";
import parse from "node-html-parser";

import acorn from "acorn"
import walk from "acorn-walk"
import { DiscordBranch } from "@mizukiTypes/DiscordBranch";
import { getUrlForBranch } from "./GetURLForBranch";

const logger = new Logger("Util/PullClientScripts")

export async function pullClientScripts(mode?: "initial" | "lazy" | "full", branch?: DiscordBranch) {
  // very janky way to get the scripts.
  // ohwell :airicry:
  if (mode == undefined) {
    mode = "full"
  }

  if (branch == undefined) {
    branch = "stable"
  }

  const URL = getUrlForBranch(branch)

  logger.log("Getting initial scripts");
  const initialDOM = await axios(URL + "/app")
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

    if (mode == "full" || mode == "initial") {
      scripts[src.replaceAll("/assets/", "")] = (await axios(URL + src)).data
    }
  }

  logger.log(`Got ${initialScripts.length} initial scripts`);

  if (mode == "full" || mode == "lazy") {
    logger.log(`Getting every script from the lazy-loaded list. This may take a while!`)
    for (let initialScript of initialScripts) {
      const file = (await axios(URL + initialScript)).data
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
              const content = (await axios(URL + "/assets/" + value)).data
              scripts[value] = content
            }
          }
        }
      })
    }
  }

  logger.log(`Got ${Object.values(scripts).length} total scripts`);
  return Object.entries(scripts)
}