import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  Interaction,
  ModalSubmitInteraction,
  PermissionsBitField,
} from "discord.js";
import { Commands, CommandsV2 } from "../Maps/CommandMaps";
import Logger from "../System/Logger";
import { ModalMap } from "@maps/ModalMap";

export default async (interaction: Interaction): Promise<void> => {
  if (interaction.isModalSubmit()) {
    handleModalSubmit(interaction);
  }

  if (interaction.isButton()) {
    handleButtonFunction(interaction);
  }

  if (interaction.isCommand()) {
    await handleSlashCommand(interaction);
  }
};

const logger = new Logger("InteractionCreate Listener");

async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  if (interaction.customId == ModalMap.ServerSetup) {
    const favoriteColor =
      interaction.fields.getTextInputValue("favoriteColorInput");
    const hobbies = interaction.fields.getTextInputValue("hobbiesInput");
    console.log({ favoriteColor, hobbies });
    await interaction.reply({
      content: "you have been doxxed. thx for ur input",
      ephemeral: true,
    });
  }
}

async function handleButtonFunction(interaction: ButtonInteraction) {
  if (interaction.customId.includes("unban")) {
    const userId = interaction.customId.replaceAll("unban", "");
    await interaction.guild?.members.unban(userId);

    await interaction.reply({
      content: "Successfully unbanned user.",
      ephemeral: true,
    });
  }
}

function getPermissionName(permission?: bigint): string {
  for (const perm in PermissionsBitField.Flags) {
    if (PermissionsBitField.Flags[perm as never] === permission) {
      return perm;
    }
  }
  return "UnknownPermission";
}

const handleSlashCommand = async (
  interaction: CommandInteraction,
): Promise<void> => {
  logger.log(
    `Trying to find a command for the interaction ${interaction.commandName}`,
  );

  const slashCommand = Commands.find((c) => c.name === interaction.commandName) || CommandsV2.find((c) => c.data.name === interaction.commandName);
  let failedPermissionCheck = false;
  if (!slashCommand) {
    logger.error(
      `Could not find an interaction for ${interaction.commandName}`,
    );
    interaction.reply({ content: "An error has occurred" });
    return;
  }

  // !SECTION! Check if the user is the instance owner ?!SECTION!?
  try {
    if (slashCommand.ownerOnly == true) {
      if (interaction.user.id != process.env.OWNER_ID) {
        interaction.reply({
          content:
            "Command failed to execute: This command is currently owner-only and is thus not available to be ran by anyone else (the description might tell you why its owner-only)",
          ephemeral: true,
        });
        return;
      }
    }
  } catch (err) {
    logger.error(
      `Command failed to execute: Failed to send the owner-only warning message ${err}`,
    );
  }

  // !SECTION! Check for permissions ?!SECTION!?
  try {
    if (slashCommand.permissions != undefined) {
      for await (const permissionBit of slashCommand.permissions) {
        if (!interaction.memberPermissions?.has(permissionBit as bigint)) {
          failedPermissionCheck = true;
          await interaction.reply({
            content: `Command failed to execute: You are missing the ${getPermissionName(
              permissionBit,
            )} permission.`,
          });
          return;
        }

        continue;
      }
    }
  } catch (err) {
    logger.error(`Failed to check for permissions: ${err}`);
    interaction.followUp({
      content: "Command failed to execute: Permission check failed",
    });
  }

  if (failedPermissionCheck === true) {
    return;
  }

  try {
    if (slashCommand.deferReply == true) {
      await interaction.deferReply({
        ephemeral: true,
      });
    }
  } catch (err) {
    logger.error(`Failed to defer-reply ${err}`);
  }

  try {
    // it is currently 2:47 am and i dont want to deal with ts's bullshit
    // TODO: dont cast as any kthx
    await slashCommand.run(interaction as any);
  } catch (err) {
    console.log(err)
    logger.error(
      `Command ${interaction.commandName} has ran into an error ${err}`,
    );
    logger.dumpLogsToDisk();
    const message =
      "The command you were trying to run has ran into an internal error. The error has been logged. If this persists, yell at haruka.";

    if (slashCommand.deferReply == true) {
      interaction.editReply({
        content: message,
      });
      return;
    }

    if (interaction.replied) {
      interaction.editReply({ content: message });
    } else {
      interaction.reply({ content: message, ephemeral: true });
    }
  }
};
