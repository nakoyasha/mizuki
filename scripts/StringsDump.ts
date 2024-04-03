import { pullClientScripts } from "@util/Tracker/ClientScriptsPuller"
import acorn, { Identifier, Literal, Node, Property } from "acorn"
import walk from "acorn-walk"
import { writeFile } from "fs/promises";
import { js_beautify } from "js-beautify";


(async () => {
  const scripts = await pullClientScripts("initial", "canary")
  const filePath = __dirname + "/../strings.json"
  const strings = {} as { [key: string]: string }

  if (scripts == undefined) {
    return;
  }

  for (let [path, script] of scripts) {
    const ast = acorn.parse(script, { ecmaVersion: 10 })

    walk.simple(ast, {
      ObjectExpression(node) {
        const properties = node.properties
        const isLangModule = properties.find(prop => (prop as any)?.key?.name == "DISCORD") != undefined

        if (isLangModule == true) {
          properties.forEach((node) => {
            const prop = node as Property
            const key = prop.key as Identifier
            const value = prop.value as Literal

            strings[key.name] = value.value as string
          })
        }
      }
    })
  }

  const asString = JSON.stringify(strings)
  const prettifiedJSON = js_beautify(asString)

  writeFile(filePath, prettifiedJSON)
})()