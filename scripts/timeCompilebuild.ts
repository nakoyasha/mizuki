import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch"
import { compileBuildData } from "../src/Util/Tracker/Util/CompileBuildData"

((async () => {
  console.time("CompileBuild")
  await compileBuildData(DiscordBranch.Canary)
  console.timeEnd("CompileBuild")
}))()