import "dotenv/config"
import { Mizuki } from "@system/Mizuki";

((async () => {
  await Mizuki.init();
  await Mizuki.start();
}))()
