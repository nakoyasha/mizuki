import Logger from "@system/Logger";
import axios from "axios";
import { writeFile } from "fs/promises";
import { js_beautify } from "js-beautify";
import { pullClientScripts } from "@util/Tracker/ClientScriptsPuller";
//import { existsSync } from "fs";

const logger = new Logger("Dumper")

const DISCORD_URL = "https://discord.com";


logger.log("Beginning script dump");
(async () => {
  const fullScripts = await pullClientScripts("lazy", "canary")

  for (let [fileName, script] of fullScripts) {
    // const fileName = script.replaceAll("/assets/", "")
    // const file = await axios(DISCORD_URL + "/assets/" + fileName)
    const filePath = __dirname + "/../dumped_scripts/" + fileName

    // const formattedScript = js_beautify(file.data)

    // // TODO: make this actually compare the two files :kanadejil:
    // // const fileExists = existsSync(path)

    // // if (fileExists) {
    // //   const oldScript = await readFile(path)

    // //   // i dont know why .toString() is a promise, but it is.
    // //   const asStringBecauseIHateBuffers = await oldScript.toString()

    // //   if (js_beautify(asStringBecauseIHateBuffers) != file.data) {
    // //     logger.log(`File ${fileName} has changed`)
    // //   }
    // // }
    writeFile(filePath, js_beautify(script))
  }
})();

