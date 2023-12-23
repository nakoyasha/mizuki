import mongoose, { Document, Model } from "mongoose"
import * as dotenv from "dotenv"
import { Guild } from "discord.js"

import Logger from "@system/Logger"
import { GuildModel } from "@system/Database/Models/GuildSchema";
const DatabaseSystemLogger = new Logger("DatabaseSystem")


export const DatabaseSystem = {
    async startMongoose() {
        // do this shit AGAINH becuase it doesnt work for some reason
        dotenv.config()

        await mongoose.connect(process.env.MONGO_URL as string)
    },

    async saveGuildData(Guild: Guild, Model: Document) {
        DatabaseSystemLogger.log(`Saving GuildData for ${Guild.id}`)
        try {
            await Model.save();
        } catch (err) {
            DatabaseSystemLogger.error(`GuildData for ${Guild.id} has failed to save: ${err}`)
            DatabaseSystemLogger.dumpLogsToDisk()
        } finally {
            DatabaseSystemLogger.log(`Saved GuildData for ${Guild.id}`)
        }
    },

    async getOrCreateGuildData(Guild: Guild) {
        try {
            var guildData = await GuildModel.findOne({ GuildId: Guild.id })

            if (guildData == undefined) {
                guildData = new GuildModel({
                    _id: new mongoose.Types.ObjectId(),
                    GuildId: Guild.id,
                })

                await this.saveGuildData(Guild, guildData)
            }

            return guildData

        } catch (err) {
            DatabaseSystemLogger.error(`The Thing has Mongoose'd: Failed to get GuildData: ${err}`)
            return;
        }
    }
}