import mongoose, { Document } from "mongoose";
import * as dotenv from "dotenv";
import { Guild } from "discord.js";

import Logger from "@system/Logger";
import { GuildModel } from "src/Models/GuildData"
import { BuildData } from "@util/Tracker/Types/BuildData";
import { BuildModel } from "@util/Tracker/Models/BuildData";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { captureException } from "@sentry/node";
const logger = new Logger("System/DatabaseSystem");

export const DatabaseSystem = {
  async startMongoose() {
    // do this AGAINH becuase it doesnt work for some reason
    dotenv.config();

    await mongoose.connect(process.env.MONGO_URL as string);
  },

  async saveGuildData(Guild: Guild, Model: Document) {
    logger.log(`Saving GuildData for ${Guild.id}`);
    try {
      await Model.save();
    } catch (err) {
      captureException(err)
      logger.error(
        `GuildData for ${Guild.id} has failed to save: ${err}`,
      );
      logger.dumpLogsToDisk();
    } finally {
      logger.log(`Saved GuildData for ${Guild.id}`);
    }
  },

  async getBuildData(BuildNumberOrHash: string, Branch: DiscordBranch) {
    const buildDataByBuildNumber = await BuildModel.findOne({ BuildNumber: BuildNumberOrHash, Branch: Branch });

    if (buildDataByBuildNumber == undefined) {
      logger.warn(`couldn't find ${BuildNumberOrHash} by build number; trying by version hash instead`)
      const buildDataByBuildHash = await BuildModel.findOne({ VersionHash: BuildNumberOrHash, Branch: Branch });

      return buildDataByBuildHash
    } else {
      return buildDataByBuildNumber
    }
  },

  async getLastSavedBuild(branch: DiscordBranch) {
    return await BuildModel.findOne({ Branch: branch }).sort({ created_at: -1 })
  },

  async createBuildData(Build: BuildData) {
    let buildDataExists = await this.getBuildData(Build.BuildNumber, Build.Branch) != undefined

    // for cases like when canary and stable are the same
    if (buildDataExists == true) {
      logger.warn(`Not saving data as the build data for ${Build.BuildNumber}-${Build.VersionHash} already exists`)
      return;
    }


    try {
      const buildData = new BuildModel({
        BuildNumber: Build.BuildNumber,
        VersionHash: Build.VersionHash,
        Date: Build.Date,
        Branch: Build.Branch,
        Experiments: Build.Experiments,
        Strings: Build.Strings,
        Scripts: Build.Scripts,
      });

      await buildData.save()
    } catch (err) {
      captureException(err)
      logger.error(
        `The Thing has Mongoose'd: Failed to create BuildData: ${err}`,
      );
      return;
    }
  },

  async getOrCreateGuildData(Guild: Guild) {
    try {
      let guildData = await GuildModel.findOne({ GuildId: Guild.id });

      if (guildData == undefined) {
        guildData = new GuildModel({
          _id: new mongoose.Types.ObjectId(),
          GuildId: Guild.id,
        });

        await this.saveGuildData(Guild, guildData);
      }

      return guildData;
    } catch (err) {
      captureException(err)
      logger.error(
        `The Thing has Mongoose'd: Failed to get GuildData: ${err}`,
      );
      return;
    }
  },
};
