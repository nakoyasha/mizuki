import { ASTPuller } from "@util/Tracker/Fetch/ASTPuller";

(async () => {
  await new ASTPuller().getClientExperiments("stable")
})()