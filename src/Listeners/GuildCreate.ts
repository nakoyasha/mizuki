import { Guild } from "discord.js";
import Logger from "@system/Logger";
import { DatabaseSystem } from "@system/DatabaseSystem";

import { captureException } from "@sentry/node"

const logger = new Logger("Listeners/GuildCreate");

export default async (Guild: Guild): Promise<void> => {
  await initializeServerData(Guild);
};

export async function initializeServerData(Guild: Guild) {
  try {
    await DatabaseSystem.getOrCreateGuildData(Guild);
  } catch (err) {
    captureException(err)
    logger.error(`Failed to get/create GuildData: ${err}`);
    return;
  }
}
