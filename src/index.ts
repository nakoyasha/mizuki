import * as dotenv from "dotenv"
dotenv.config()

import { client } from "./ClientContainer"
import Listeners from "./Listeners/Listeners"
import { JobSystem } from "./ServerJobs"

client.on("ready", Listeners.Ready)
client.on("interactionCreate", Listeners.InteractionCreate)
client.on("messageCreate", Listeners.MessageCreate)

client.login(process.env.TOKEN)
JobSystem.start();