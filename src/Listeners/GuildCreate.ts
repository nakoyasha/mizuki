import { Guild } from "discord.js";
import Logger from "@system/Logger";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
const logger = new Logger("Listeners/GuildCreate");

export default async (Guild: Guild): Promise<void> => {
  await initializeServerData(Guild);
};

export async function initializeServerData(Guild: Guild) {
  try {
    await DatabaseSystem.getOrCreateGuildData(Guild);
  } catch (err) {
    logger.error(`Failed to get/create GuildData: ${err}`);
    return;
  }
}
