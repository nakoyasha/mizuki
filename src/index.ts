import { client } from "./ClientContainer"
import Listeners from "./Listeners/Listeners"

client.on("ready", Listeners.Ready)
client.on("interactionCreate", Listeners.InteractionCreate)

client.login("MTEwODEyNzE4NzgyMDg3MTc5MA.GPQ2w6.m8tbdPTHs2-rxrmcx1LE0jm4AYY6aYTrt65F4g")