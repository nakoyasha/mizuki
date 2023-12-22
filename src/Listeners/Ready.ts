import { ActivityType } from "discord.js"
import { client } from "../ClientContainer"
import { Commands } from "../Maps/CommandMaps";

export default async (): Promise<void> => {
    console.log("mizuki gaming")
    await client.application?.commands.set(Commands);

    client.user?.setPresence({
        status: "online", activities: [
            {
                name: "HATSUNE MIKU: COLORFUL STAGE!",
                type: ActivityType.Playing
            }
        ]
    })
}