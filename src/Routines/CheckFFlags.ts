import { MizukiRoutine } from "@mizukiTypes/MizukiRoutine";
import Logger from "@system/Logger";
import { Mizuki } from "@system/Mizuki";
import { constants } from "@util/Constants";
import { ClientSettingsFetcher } from "@util/RobloxTracker/ClientSettingsFetch";
import { FFlag } from "@util/RobloxTracker/Types/FFlag";
import { RobloxApplication } from "@util/RobloxTracker/Types/RobloxApplication";
import { EmbedBuilder, TextChannel } from "discord.js";

import config from "../../config.json"

const fetcher = new ClientSettingsFetcher()
const logger = new Logger("Routines/CheckFFlags")



let lastFFlags: FFlag[] | undefined = undefined;

export function createFFlagBuildDiff(newFlags: FFlag[], oldFlags: FFlag[]) {
  const addedFlags = []
  const removedFlags = []
  const changedFlags = []

  // strings pass
  for (const flag of oldFlags) {
    const originalFlag = newFlags.find(flag => flag.name === flag.name)

    if (originalFlag == undefined) {
      addedFlags.push(`+ ${flag.name}: "${flag.value}"`)
    } else if (originalFlag.value != flag.value) {
      changedFlags.push(`- ${flag.name}: "${originalFlag.value}"`)
      changedFlags.push(`+ ${flag.name}: "${flag.value}"`)
    }
  }

  for (const flag of newFlags) {
    const compareValue = oldFlags.find(flag => flag.name === flag.name)

    if (compareValue == undefined) {
      removedFlags.push(`- ${flag.name}: "${flag.value}"`)
    }
  }

  return {
    addedFlags,
    removedFlags,
    changedFlags
  }
}

export class CheckFFlags implements MizukiRoutine {
  name = "Checks and diffs the latest FFlags";
  run_every = 1800000;
  async execute() {
    if (config.routines.checkFFlags.enabled == false) {
      return;
    }

    try {
      const channel: TextChannel = await Mizuki.client.channels.fetch(config.routines.checkFFlags.channel) as TextChannel
      const fflags = await fetcher.getFFlags(RobloxApplication.PCStudioApp)

      if (lastFFlags != undefined) {
        const diff = createFFlagBuildDiff(fflags, lastFFlags)
        const embed = new EmbedBuilder()
        embed.setTitle("ClientSettings FFlags changed!")
        embed.setColor(constants.colors.roblox_white)
        embed.setFooter({
          text: "",
          iconURL: constants.icons.roblox
        })

        const addedFFlags = diff.addedFlags
        const changedFFlags = diff.changedFlags
        const removedFFlags = diff.removedFlags


        if (addedFFlags.length == 0 && changedFFlags.length == 0 && removedFFlags.length == 0) {
          // no point in comparing it!
          return;
        } else {
          embed.setDescription(`
            ${addedFFlags.length != 0 && `**Added:** \`\`\`diff\n${addedFFlags.join("\n")} \`\`\` ` || ""}
            ${changedFFlags.length != 0 && `**Changed:**\n \`\`\`diff\n${changedFFlags.join("\n")} \`\`\` ` || ""}
            ${removedFFlags.length != 0 && `**Removed:**\n \`\`\`diff\n${removedFFlags} \`\`\` ` || ""}
          `)
        }

        channel.send({
          content: "ClientSettings changed!",
          embeds: [embed],
        })

      } else {
        logger.log("No LastFFlags in memory!")
        lastFFlags = fflags;
      }
    } catch (err) {
      logger.error(`Failed to fetch FFlags: ${err}`)
    }
  }
}
