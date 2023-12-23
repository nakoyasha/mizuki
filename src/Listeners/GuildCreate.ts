import { Guild } from "discord.js";
import Logger from "../System/Logger";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
const GuildCreateLogger = new Logger("GuildCreate")


export default async (Guild: Guild): Promise<void> => {
    await initializeServerData(Guild)
};

export async function initializeServerData(Guild: Guild) {
    try {
        await DatabaseSystem.getOrCreateGuildData(Guild)
    } catch (err) {
        GuildCreateLogger.error(`Failed to get/create GuildData: ${err}`)
        return;
    }
}