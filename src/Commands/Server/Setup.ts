import { ApplicationCommandOptionType, CommandInteraction, Emoji } from "discord.js";
import { Command } from "../../CommandInterface";
import axios from "axios";
import Emojis from "../../Emojis"

const badBadBadCodes = [
    500,
    501,
    502,
    503,
    504,
]

export const Setup: Command = {
    name: "setup",
    options: [
    ],
    description: "Starts the Server Configuration Wizard",
    run: async (interaction: CommandInteraction) => {
        interaction.reply("todo: make this work" + Emojis.youtried)
    }
}