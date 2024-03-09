import { SaveBuild } from "src/Routines/SaveBuild";
import Logger from "./Logger";
import { captureException } from "@sentry/node";

const logger = new Logger("System/RoutineSystem")

// TODO: make this implementation less janky xd
export const RoutineSystem = {
  routines: [
    SaveBuild,
  ],
  start() {
    this.routines.forEach(routine => {
      async function startRoutine(firstRun?: boolean) {
        if (firstRun != true) {
          try {
            logger.log(`Routine ${routine.name} is starting`)
            await routine.execute()
            logger.log(`Routine ${routine.name} has finished!`)
          } catch (err) {
            captureException(err)
            logger.error(`Routine ${routine.name} has encountered an error: ${err}`)
          }
        }
        setTimeout(startRoutine, routine.run_every)
      }
      startRoutine(true)
    })
  },
};
