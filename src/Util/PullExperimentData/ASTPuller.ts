import { pullClientScripts } from "@util/PullClientScripts";
import { Experiment } from ".";
import { ExperimentPuller } from "./ExperimentPuller";

import acorn, { Identifier, ArrayExpression, ObjectExpression, Property } from "acorn"
import walk from "acorn-walk"

export type Treatment = {
  id: number,
  label: string,
}

export function parseTreatments(Array: ArrayExpression) {
  const treatments = Array.elements as ObjectExpression[]
  const parsedTreatments = [] as Treatment[]

  treatments.forEach(treatment => {
    const id = treatment.properties.find((prop) => (prop as any)?.key?.name == "id") as Property
    const label = treatment.properties.find((prop) => (prop as any)?.key?.name == "label") as Property

    const idValue = id?.value as any
    const labelValue = label?.value as any

    parsedTreatments.push({
      id: (idValue?.value as number),
      label: (labelValue?.value as string),
    })
  })

  return parsedTreatments
}

export class ASTPuller implements ExperimentPuller {

  // Sometimes axios will throw a weird "socket hang up" error.
  // TODO: Handle errors properly.
  async getClientExperiments(): Promise<void | Experiment[] | undefined> {
    const experiments = {} as { [key: string]: any }
    const scripts = await pullClientScripts()

    for (const [path, script] of scripts) {
      const ast = acorn.parse(script, { ecmaVersion: 10 })

      walk.simple(ast, {
        ObjectExpression(node) {
          const properties = node.properties
          const kind = properties.find(prop => (prop as any)?.key?.name == "kind")
          const id = properties.find(prop => (prop as any)?.key?.name == "id")
          const label = properties.find(prop => (prop as any)?.key?.name == "label")
          const defaultConfig = properties.find(prop => (prop as any)?.key?.name == "defaultConfig")
          const treatments = properties.find(prop => (prop as any)?.key?.name == "treatments")

          const isExperiment = kind != undefined &&
            id != undefined &&
            label != undefined &&
            defaultConfig != undefined &&
            treatments != undefined

          const kindValue = (kind as any)?.value?.value
          const labelValue = (label as any)?.value?.value
          const idValue = (id as any)?.value?.value


          if (isExperiment == true) {
            const parsedTreatments = parseTreatments((treatments as any)?.value)
            experiments[idValue] = {
              type: kindValue,
              hash_key: idValue,
              title: labelValue,
              name: labelValue,
              description: parsedTreatments.map((a) => a.label),
              buckets: parsedTreatments.map((a) => a.id),

              // all of these are placeholder since PullExperimentData does it 
              hash: 0xff,

              // this can be anything 
              revision: 0xff,
              rollout_position: 0xff,
              aa_mode: false,
            }
          }
        }
      })
    }

    return experiments as Experiment[]
  }

}