import Logger from "@system/Logger"
import { Client } from "discord.js"
import { JobSystem } from "@system/JobSystem"
import Listeners from "src/Listeners/Listeners"


// Mizuki's main class

export const Mizuki = {
    logger: new Logger("Mizuki"),
    client: new Client({
        intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"]
    }),
    init() {
        this.logger.log("initializing listeners")
        this.client.on("ready", Listeners.Ready)
        this.client.on("interactionCreate", Listeners.InteractionCreate)
        this.client.on("messageCreate", Listeners.MessageCreate)
    },
    async start() {
        this.logger.log("Mizuki Initlization Begin")
        this.logger.log("Attempting login..")
        try {
            await this.client.login(process.env.TOKEN)
        } catch (err) {
            this.logger.error(`Failed to login ${err}`)
        } finally {
            this.logger.log(`Logged in as ${this.client.user?.username}#${this.client.user?.discriminator}`)
        }
        this.logger.log("Starting the Job System..")
        JobSystem.start();

    }
}