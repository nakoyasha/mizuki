import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch"
import { compileBuildData } from "../src/Util/Tracker/Util/CompileBuildData"
import { DatabaseSystem } from "@system/DatabaseSystem"

((async () => {
  await DatabaseSystem.startMongoose()
  console.time("CompileBuild")
  await compileBuildData(DiscordBranch.Canary)
  console.timeEnd("CompileBuild")
}))()