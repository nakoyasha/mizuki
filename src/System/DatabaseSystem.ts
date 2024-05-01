import mongoose, { Document } from "mongoose";
import * as dotenv from "dotenv";
import { Guild } from "discord.js";

import Logger from "@system/Logger";
import { GuildModel } from "src/Models/GuildData"
import { BuildData } from "@util/Tracker/Types/BuildData";
import { BuildModel } from "@util/Tracker/Schemas/BuildSchema";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { captureException } from "@sentry/node";
const logger = new Logger("System/DatabaseSystem");

export const DatabaseSystem = {
  async startMongoose() {
    // do this AGAINH becuase it doesnt work for some reason
    dotenv.config();

    await mongoose.connect(process.env.MONGO_URL as string);
  },

  async getBuilds(limit: number = 15, smol: boolean = false): Promise<BuildData[]> {
    const filteredFields: Record<any, any> = smol == true && {
      _id: false,
      scripts: false,
      strings_diff: false,
      experiments: false,

      // legacy builds
      Scripts: false,
      Strings: false,
      Experiments: false,

      // why is this even here??
      __v: false,
    } || {
      // nuh uh
      __v: false,
    }

    const fetchedBuilds = await BuildModel.find().limit(limit).select(filteredFields).exec();
    const builds: BuildData[] = []

    for (const build of fetchedBuilds) {
      builds.push(build)
    }

    return builds
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

  async getBuildData(BuildHash: string, branch: DiscordBranch = DiscordBranch.Canary): Promise<BuildData | null> {
    return await BuildModel.findOne({ build_hash: BuildHash, branches: [branch] }).exec()
  },

  async getLegacyBuildData(BuildHash: string): Promise<BuildData | null> {
    return await BuildModel.findOne({ VersionHash: BuildHash }).exec()
  },


  async overwriteBuildData(buildHash: string, newBuildData: BuildData) {
    logger.log("Deleting existing build..")
    await BuildModel.deleteOne({ build_hash: buildHash }).exec()
    logger.log("Saving the new one..")
    await new BuildModel(newBuildData).save()
  },

  async getLastBuild(branch: DiscordBranch = DiscordBranch.Stable) {
    const build: BuildData = await BuildModel.findOne({
      branches: [branch]
    }).sort({ id: -1 }).exec() as BuildData
    return build
  },

  async createBuildData(Build: BuildData, Branch: DiscordBranch, lastBuild?: BuildData, forceSave?: boolean) {
    let existingBuildData = await BuildModel.findOne({ build_hash: Build.build_hash }).exec()

    // if there's existing build data, and we haven't found this build on the specified branch..
    if (existingBuildData !== null && forceSave !== true) {
      if (!existingBuildData.branches.includes(Branch)) {
        logger.log(`Build ${Build.build_hash} was found on a different branch!`)
        existingBuildData.branches = [...Build.branches, Branch]
        await existingBuildData.save()
      } else {
        logger.log(`Skipping build ${Build.build_hash} as it is already saved`)
      }
      return;
    }
    try {
      if (lastBuild != undefined) {
        // set the last build to be diffed against later
        Build.diff_against = lastBuild?.build_hash
      }

      const buildData = new BuildModel(Build);
      await buildData.save()
    } catch (err) {
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
