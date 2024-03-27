import { BuildData } from "@util/Tracker/Types/BuildData";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { MizukiRoutine } from "@mizukiTypes/MizukiRoutine";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import Logger from "@system/Logger";
import { compileBuildData } from "@util/Tracker/Util/CompileBuildData";

import * as Sentry from "@sentry/node"

const logger = new Logger("Routines/SaveBuild");

async function saveBuild(branch: DiscordBranch) {
  try {
    logger.log(`Compiling current ${branch} build..`)
    const build = await compileBuildData(branch) as BuildData

    logger.log(`Saving build ${build.BuildNumber}`)
    await DatabaseSystem.createBuildData(build)
    logger.log(`Build ${build.BuildNumber} has been saved`)
  } catch (err) {
    Sentry.captureException(err)
    logger.error(`Compile failed: ${err}`)
  }
}

export const SaveBuild: MizukiRoutine = {
  name: "Save latest discord builds",
  // every hour
  run_every: 3600000,
  execute: async () => {
    try {
      await saveBuild("stable")
      await saveBuild("canary")
    } catch (err) {
      Sentry.captureException(err)
      logger.error(`Routine failed: ${err}`)
    }
  }
}
