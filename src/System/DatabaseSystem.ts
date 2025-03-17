import mongoose, { Document } from "mongoose";
import * as dotenv from "dotenv";
import { Guild } from "discord.js";

import Logger from "@system/Logger";
import { GuildModel } from "../Models/GuildData";
import { captureException } from "@sentry/node";
import { Mizuki } from "./Mizuki";
const logger = new Logger("System/DatabaseSystem");

export const DatabaseSystem = {
  async startMongoose() {
    // do this AGAINH becuase it doesnt work for some reason
    dotenv.config();

    mongoose
      .connect(process.env.MONGO_URL as string)
      .then(() => {
        logger.log("Connected to the database successfully!");
      })
      .catch((err: Error) => {
        Mizuki.disabledFeatures.datamining = true;
        Mizuki.disabledFeatures.regex = true;
        Mizuki.disabledFeatures.serverSettings = true;
        logger.warn(
          `Database connection failed! ${err.message} - ${err.cause}`
        );
        logger.warn(
          "As a result, Mizuki has disabled any commands that utilize the database."
        );
      });
  },

  async saveGuildData(Guild: Guild, Model: Document) {
    logger.log(`Saving GuildData for ${Guild.id}`);
    try {
      await Model.save();
    } catch (err) {
      captureException(err);
      logger.error(`GuildData for ${Guild.id} has failed to save: ${err}`);
      logger.dumpLogsToDisk();
    } finally {
      logger.log(`Saved GuildData for ${Guild.id}`);
    }
  },

  async getOrCreateGuildData(Guild: Guild) {
    try {
      let guildData = await GuildModel.findOne({ guild_id: Guild.id });

      if (guildData == undefined) {
        guildData = new GuildModel({
          _id: new mongoose.Types.ObjectId(),
          guild_id: Guild.id,
        });

        await this.saveGuildData(Guild, guildData);
      }

      return guildData;
    } catch (err) {
      captureException(err);
      throw err;
    }
  },
};
