import { pullClientScripts } from "@util/Tracker/ClientScriptsPuller";
import { writeFileSync } from "fs";

import { join } from "path"
import { js_beautify } from "js-beautify";

(async () => {
  const scripts = await pullClientScripts("full", "canary")

  if (scripts != undefined) {
    console.log(`Dumping ${scripts.size} scripts..`)
    scripts.forEach(async (script, path) => {
      console.log(`Dumping ${path}`)
      writeFileSync(join(__dirname, "../dumped_scripts", path), await js_beautify(script))
    })
  }
})()