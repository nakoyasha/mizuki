import { CommandInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import { Commands } from "../Maps/CommandMaps"
import Logger from "../System/Logger";
import { ModalMap } from "@maps/ModalMap";

export default async (interaction: Interaction): Promise<void> => {
    if (interaction.isModalSubmit()) {
        handleModalSubmit(interaction)
    }

    if (interaction.isCommand()) {
        await handleSlashCommand(interaction);
    }

};

const logger = new Logger("InteractionCreate Listener")

async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId == ModalMap.ServerSetup) {
        const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
        const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
        console.log({ favoriteColor, hobbies });
        await interaction.reply({ content: "you have been doxxed. thx for ur input", ephemeral: true })
    }
}

const handleSlashCommand = async (interaction: CommandInteraction): Promise<void> => {
    logger.log(`Trying to find a command for the interaction ${interaction.commandName}`)
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        logger.error(`Could not find an interaction for ${interaction.commandName}`)
        interaction.reply({ content: "An error has occurred" });
        return;
    }

    try {
        if (slashCommand.ownerOnly == true) {
            if (interaction.user.id != process.env.OWNER_ID) {
                interaction.reply({ content: "This command is currently owner-only and is thus not available to be ran by anyone else (the description might tell you why its owner-only)", ephemeral: true })
                return;
            }
        }
    } catch (err) {
        logger.error(`Failed to send the owner-only warning message ${err}`)
    }

    try {
        if (slashCommand.deferReply == true) {
            await interaction.deferReply({
                ephemeral: true,
            });
        }
    } catch (err) {
        logger.error(`Failed to defer-reply ${err}`)
    }

    try {
        await slashCommand.run(interaction);
    } catch (err) {
        logger.error(`Command ${interaction.commandName} has ran into an error ${err}`)
        logger.dumpLogsToDisk()
        const message = "The command you were trying to run has ran into an internal error. The error has been logged. If this persists, yell at haruka."

        if (slashCommand.deferReply == true) {
            interaction.editReply({
                content: message
            })
            return;
        }

        if (interaction.replied) {
            interaction.editReply({ content: message })
        } else {
            interaction.reply({ content: message, ephemeral: true })
        }



    }
};