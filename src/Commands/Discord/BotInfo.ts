import { CommandInteraction, EmbedBuilder, ApplicationCommandType, Emoji } from "discord.js";
import { Command } from "src/CommandInterface";

import os from "os"
import { Mizuki } from "@system/Mizuki";
import Logger from "@system/Logger";
import { Emojis } from "@maps/EmojisMap";

function formatDuration(sec_num: number) {
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);

    var hoursString = hours.toString()
    var minutesString = minutes.toString()
    var secondsString = seconds.toString()


    if (hours < 10) { hoursString = "00" + hoursString; }
    if (minutes < 10) { minutesString = "00" + minutesString; }
    if (seconds < 10) { secondsString = "00" + secondsString; }
    return hours + ':' + minutes + ':' + seconds;
}

const BotInfoLogger = new Logger("BotInfo")

export const BotInfo: Command = {
    name: "info",
    options: [
    ],
    description: "Shows some debug stats about the bot.",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    ownerOnly: false,
    run: async (interaction: CommandInteraction) => {
        const cores = os.cpus()
        const cpu = cores[0]
        const serverCount = Mizuki.client.guilds.cache.size
        const memberCount = Mizuki.totalMemberCount

        const uptimeString = formatDuration(Math.floor(process.uptime()))
        var githubStarCount = 1;
        var githubContributors = 1;

        // try and get github stars 
        try {

        } catch (err) {
            BotInfoLogger.log(`Failed to get GitHub Stars: ${err}`)
        }

        // get github contributors
        try {

        } catch (err) {
            BotInfoLogger.log(`Failed to get GitHub Contributors: ${err}`)
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('Mizuki Stats')
            .setDescription(
                `Bot created by <@222069018507345921> for fun!` +
                `\nIncludes features useful for server owners, players of a specific gacha game, and for people who want to make silly gifs.\n` +
                `**:star: Stars:** ${githubStarCount}\n` +
                `**${Emojis.steamhappy} Total Contributors:** ${githubContributors}` +
                `\n\nPlease check out the [original repo!](https://github.com/nakoyasha/mizuki)`
            )
            .addFields(
                { name: `Bot Instance Owner`, value: `<@${Mizuki.ownerObject?.id}> (${Mizuki.ownerObject?.username})`, inline: true, },
                { name: "Running on", value: `${os.type()} ` + os.release(), inline: true },
                { name: "CPU", value: cpu.model, inline: true },
                { name: `Serving`, value: `${serverCount} servers`, inline: true, },
                { name: `Known Unique Users`, value: `${memberCount} users`, inline: true, },
                { name: `Uptime`, value: uptimeString, inline: true, }
            )
        interaction.reply({ embeds: [embed] })
    }
};