import { createWorker } from "tesseract.js";
import { Guild, Message } from "discord.js";
import { DatabaseSystem } from "@system/DatabaseSystem";
import Logger from "@system/Logger";
import { captureException } from "@sentry/node";

const logger = new Logger("Listeners/MessageCreate");

async function getTextFromImage(imageURL: string) {
  const worker = await createWorker("eng");
  const ret = await worker.recognize(imageURL);
  await worker.terminate();

  return ret.data.text;
}

export default async (message: Message): Promise<void> => {
  if (message.author.bot == true) {
    return;
  }
  const GuildData = await DatabaseSystem.getOrCreateGuildData(
    message.guild as Guild
  );

  GuildData?.regex_rules?.forEach((rule) => {
    const exp = new RegExp(rule.rule, "g");
    try {
      logger.log("Trying to match message content");
      if ([...message.content.matchAll(exp)].length != 0) {
        message.reply(rule.response);
        return;
      }
    } catch (err) {
      captureException(err);
      logger.error(`Failure while matching regex: ${err}`);
    }

    logger.log("Trying to match attachments for regex");
    // ocr garbage!!
    message.attachments.forEach(async (attachment) => {
      try {
        const text = await getTextFromImage(attachment.proxyURL);

        if ([...text.matchAll(exp)].length != 0) {
          logger.log(`Rule ${rule.name} found a match`);
          message.reply(rule.response);
        }
      } catch (err) {
        captureException(err);
        message.channel.send("failed to get ocr :( " + err);
      }
    });
  });
};
