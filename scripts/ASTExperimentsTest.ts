import { ASTPuller } from "@util/Tracker/Fetch/ASTPuller";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";

(async () => {
  await new ASTPuller().getClientExperiments(DiscordBranch.Stable)
})()