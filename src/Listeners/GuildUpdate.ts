import { GuildFeatures } from "@mizukiTypes/GuildData";
import { DatabaseSystem } from "@system/DatabaseSystem";
import { Mizuki } from "@system/Mizuki";
import { Guild, TextChannel } from "discord.js";

async function postLog(content: string, logChannelId: string) {
  const channel = Mizuki.client.channels.cache.find((channel) => channel.id == logChannelId) as TextChannel

  if (channel != undefined) {
    channel.send(content)
  }
}

export default async (oldGuild: Guild, newGuild: Guild): Promise<void> => {
  const guildData = await DatabaseSystem.getOrCreateGuildData(newGuild)

  // check if invites were re-enabled.
  const invitesEnabled = (oldGuild.features.includes("INVITES_DISABLED") && newGuild.features.includes("INVITES_DISABLED") != true)
  const autoInvitesDisableEnabled = guildData.features.includes(GuildFeatures.AutoInvitesDisabler)
  const logChannelId = guildData.log_channel

  if (
    invitesEnabled && autoInvitesDisableEnabled
  ) {
    console.log("hi")
    setTimeout(() => {
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
    }, 3000)
  }
};
