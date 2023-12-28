import { createWorker } from 'tesseract.js';
import { Guild, Message } from "discord.js";
import { DatabaseSystem } from '@system/Database/DatabaseSystem';
import Logger from '@system/Logger';

const MessageCreateLogger = new Logger("MessageCreate")

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
    const GuildData = await DatabaseSystem.getOrCreateGuildData(message.guild as Guild)

    GuildData?.RegexRules?.forEach(rule => {
        const exp = new RegExp(rule.rule, 'g')
        try {
            MessageCreateLogger.log(`Trying to match message content`)
            if ([...message.content.matchAll(exp)].length != 0) {
                message.reply(rule.response);
                return;
            }
        } catch (err) {
            MessageCreateLogger.error(`Failure while matching regex: ${err}`)
        }

        MessageCreateLogger.log(`Trying to match attachments for regex`)
        // ocr garbage!!
        message.attachments.forEach(async attachment => {
            try {
                const text = await getTextFromImage(attachment.proxyURL)

                if ([...text.matchAll(exp)].length != 0) {
                    MessageCreateLogger.log(`Rule ${rule.name} found a match`)
                    message.reply(rule.response);
                }
            } catch (err) {
                message.channel.send("failed to get ocr :( " + err)
            }

        })
    })
};
