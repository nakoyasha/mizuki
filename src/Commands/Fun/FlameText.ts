import { CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder } from "discord.js";
import axios from "axios"

import { Command } from "../../CommandInterface";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";
import path from "path";
import { DownloadFile, tempDir } from "../..//Util/DownloadFile";
import makeID from "../../Util/makeID"
import { createReadStream } from "fs";

export type ResponseData = {
    logoId: number,
    newId: number,
    renderLocation: string,
    isAnimated: boolean,
}




export const FlameText: Command = {
    name: "flametext",
    options: [
        {
            name: "text",
            description: "What should the gif say?",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    description: "Generates one of those burning text gifs.",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const text = interaction.options.get("text")?.value as string
        const form = new FormData()
        form.append("LogoID", "4")
        form.append("Text", text)
        form.append("FontSize", "70")
        form.append("Color1_color", "#FF0000")
        form.append("BackgroundColor_color", "#FFFFFF")
        form.append("Integer1", "15")
        form.append("Boolean1", "on")
        form.append("Integer13", "on")
        form.append("Integer12", "on")

        try {
            const result = await axios.postForm("https://cooltext.com/PostChange", form)

            if (result.status == 200) {
                const body = result.data as ResponseData
                const outTempDir = path.join(tempDir, makeID(6)) + ".gif"
                await DownloadFile(body.renderLocation, outTempDir)
                const stream = createReadStream(outTempDir);

                const attachment = new AttachmentBuilder(stream)
                try {
                    await interaction.reply({
                        files: [attachment],
                        ephemeral: false,
                    })
                } catch {
                    // I DONT CARE
                    // this is only here because discord cant make a competent redis integration
                    // so it hallucinates and thinks the interaction doesn't exist (theyre the ones who sent out the event)
                    // (schizo)
                }
                stream.close()
            } else {
                throw new Error("Status wasn't 200 for some reason")
            }
        } catch (error: any) {
            console.log(error)
            interaction.reply("this would have a more useful error, but javascript developers are fucking retarded.")
        }
    }
};