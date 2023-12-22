import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "../../CommandInterface";

export const GameBan: Command = {
    name: "game-ban",
    options: [
        {
            name: "user",
            description: "Who to ban?",
            type: ApplicationCommandOptionType.String || ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "permanent",
            description: "Is the ban permanent?",
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
        {
            name: "duration",
            description: "For how long to ban the user for?",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
    ],
    description: "Game ban an user.",
    run: async (interaction: CommandInteraction) => {
        interaction.reply("fuck you");
    }
}