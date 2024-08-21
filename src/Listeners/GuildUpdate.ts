import { GuildFeatures } from "@mizukiTypes/GuildData";
import { DatabaseSystem } from "@system/DatabaseSystem";
import { Mizuki } from "@system/Mizuki";
import { AttachmentBuilder, Guild, TextChannel } from "discord.js";

async function postLog(content: string, logChannelId: string, files?: any[]) {
  const channel = Mizuki.client.channels.cache.find((channel) => channel.id == logChannelId) as TextChannel

  if (channel != undefined) {
    channel.send({ content, files })
  }
}

const runningTimeouts = new Map<string, NodeJS.Timeout>()
const guildDebounces = new Map<string, boolean>()

export default async (oldGuild: Guild, newGuild: Guild): Promise<void> => {

  const guildData = await DatabaseSystem.getOrCreateGuildData(newGuild)

  // check if invites were re-enabled.
  const invitesEnabled = (oldGuild.features.includes("INVITES_DISABLED") && (newGuild.features.includes("INVITES_DISABLED") != true))
  const autoInvitesDisableEnabled = guildData.features.includes(GuildFeatures.AutoInvitesDisabler)
  const logChannelId = guildData.log_channel

  // a workaround for the weird bug where discord sends two GUILD_UPDATE events(?);
  // one where the invites are enabled, and the other where they're disabled.
  // maybe they're sending the new guild first and then the old guild?
  // soo janky..

  if (guildDebounces.get(newGuild.id) == true) {
    guildDebounces.set(newGuild.id, false)
    return;
  }
  if (invitesEnabled == true) {
    guildDebounces.set(newGuild.id, true)
  }

  if (
    invitesEnabled && autoInvitesDisableEnabled
  ) {
    if (logChannelId != undefined) {
      postLog("Warning: Invites will be **disabled** again in 30 minutes (incase someone forgor <:sk:1029462631163117629>)", logChannelId)
    }
    const timeout = setTimeout(() => {
      (async () => {
        if (logChannelId != undefined) {
          postLog("Auto-disabling invites because someone forgot to disable them <:sk:1029462631163117629>", logChannelId)
        }

        const response = await fetch(`https://discord.com/api/v9/guilds/${newGuild.id}`, {
          "headers": {
            "content-type": "application/json",
            "authorization": `Bot ${Mizuki.secrets.TOKEN}`,
          },
          "body": JSON.stringify({ features: [...newGuild.features, "INVITES_DISABLED"] }),
          "method": "PATCH",
        });

        if (!response.ok) {
          if (logChannelId != undefined) {
            postLog(`failed to auto-disable invites: ${response.status} - ${await response.text()}, sob`, logChannelId)
          }
          return;
        }
      })()
      runningTimeouts.delete(newGuild.id)
    }, 30 * 60000)

    runningTimeouts.set(newGuild.id, timeout)
  } else {
    const timeout = runningTimeouts.get(newGuild.id)

    if (timeout != undefined) {
      if (logChannelId != undefined) {
        // const newGuildBuffer = Buffer.from(JSON.stringify(newGuild, null, 2))
        // const oldGuildBuffer = Buffer.from(JSON.stringify(oldGuild, null, 2))

        postLog("Invite timer cancelled as invites have been disabled again.", logChannelId,
          // [
          // new AttachmentBuilder(newGuildBuffer, {
          // name: "newGuild.json"
          // }),
          // new AttachmentBuilder(oldGuildBuffer, {
          // name: "oldGuild.json"
          // })
          // ]
        )
      }
      clearTimeout(timeout)
    }
  }
};
