import { createWorker } from 'tesseract.js';
import { Message } from "discord.js";

async function getTextFromImage(imageURL: string) {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imageURL);
    await worker.terminate();

    return ret.data.text;
}

export default async (message: Message): Promise<void> => {
    // go fuck yourself
    if (message.author.bot == true) {
        return;
    }

    // ocr garbage!!
    message.attachments.forEach(async attachment => {
        try {
            const text = await getTextFromImage(attachment.proxyURL)

            if (text.matchAll(/(fuck)/g)) {
                message.reply("Nop");
            }
        } catch (err) {
            message.channel.send("failed to get ocr :( " + err)
        }

    })
};
