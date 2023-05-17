import { ActivityType } from "discord.js"
import { client } from "../ClientContainer"
import { Commands } from "../Commands/Commands";

export default async (): Promise<void> => {
    console.log("Silverwolf gaming")
    await client.application?.commands.set(Commands);

    client.user?.setPresence({
        status: "online", activities: [
            {
                name: "silver wolf gaming",
                type: ActivityType.Playing
            }
        ]
    })
}