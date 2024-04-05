import { Mizuki } from "@system/Mizuki";
import { SaveBuild } from "src/Routines/SaveBuild";

(async () => {
  await Mizuki.init()
  await Mizuki.start()
  await new SaveBuild().execute()
})()