import { BuildData } from "@mizukiTypes/BuildData";
import { DiscordBranch } from "@mizukiTypes/DiscordBranch";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import Logger from "@system/Logger";
import { Mizuki } from "@system/Mizuki";
import { compileBuildData } from "@util/CompileBuildData";

const logger = new Logger("Routines/SaveBuild");

async function getAndSaveBuild(branch: DiscordBranch) {
  try {
    logger.log(`Compiling current ${branch} build..`)
    const build = await compileBuildData(branch) as BuildData

    logger.log(`Saving build ${build.BuildNumber}`)
    await DatabaseSystem.createBuildData(build)
    logger.log(`Build ${build.BuildNumber} has been saved`)
  } catch (err) {
    logger.error(`Compile failed: ${err}`)
  }
}

(async () => {
  // just so we get mongodb :p
  Mizuki.init()
  try {
    await getAndSaveBuild("stable")
    await getAndSaveBuild("canary")
  } catch (err) {
    logger.error(`Routine failed: ${err}`)
  }
})()