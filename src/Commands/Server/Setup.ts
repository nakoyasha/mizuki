import { CommandInteraction, TextInputStyle } from "discord.js";
import { Command } from "../../CommandInterface";
import Emojis from "@maps/EmojisMap"
import { Events, ModalBuilder } from "discord.js";
import { ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder } from "@discordjs/builders";
import { ModalMap } from "@maps/ModalMap";

export const Setup: Command = {
    name: "setup",
    options: [
    ],
    deferReply: false,
    description: "Starts the Server Configuration Wizard",
    run: async (interaction: CommandInteraction) => {
        interaction.reply("todo: make this work" + Emojis.youtried)
        const modal = new ModalBuilder()
            .setCustomId(ModalMap.ServerSetup)
            .setTitle('Server Setup');

        // Add components to modal

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("What's some of your favorite hobbies?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}