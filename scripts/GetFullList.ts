import { parse } from "acorn";
import walk from "acorn-walk";
import axios from "axios";

(async () => {
  const script = (await axios("https://discord.com/assets/web.166a966bc430fcd6aff2.js")).data
  const parsed = parse(script, { ecmaVersion: 9 })

  walk.simple(parsed, {
    // ObjectExpression(node) {
    //   console.log(node.properties)
    // },

    Literal(node) {
      const value = node.value
      if (typeof value === "string") {
        if ((value as string).endsWith(".js")) {
          console.log(`yop: ${value}`)
        }
      }
    }
  })
})()