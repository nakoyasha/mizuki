import { Client } from "discord.js"

export const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"]
})