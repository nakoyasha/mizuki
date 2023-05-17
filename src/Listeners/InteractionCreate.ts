import { CommandInteraction, Interaction } from "discord.js";
import { Commands } from "../Commands/Commands"

export default async (interaction: Interaction): Promise<void> => {
    if (interaction.isCommand()) {
        await handleSlashCommand(interaction);
    }
};

const handleSlashCommand = async (interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(interaction);
};