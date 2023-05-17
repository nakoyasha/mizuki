import * as dotenv from "dotenv"
dotenv.config()

import { client } from "./ClientContainer"
import Listeners from "./Listeners/Listeners"


client.on("ready", Listeners.Ready)
client.on("interactionCreate", Listeners.InteractionCreate)

client.login(process.env.TOKEN)