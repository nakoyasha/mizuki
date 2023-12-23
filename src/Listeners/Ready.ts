import { ActivityType } from "discord.js"
import { Commands } from "../Maps/CommandMaps";
import { Mizuki } from "@system/Mizuki";

export default async (): Promise<void> => {
    console.log("mizuki gaming")
    await Mizuki.client.application?.commands.set(Commands);
    console.log("mizu")

    Mizuki.client.user?.setPresence({
        status: "online", activities: [
            {
                name: "HATSUNE MIKU: COLORFUL STAGE!",
                type: ActivityType.Playing
            }
        ]
    })
}