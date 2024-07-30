import {
  ButtonInteraction,
  CommandInteraction,
  Interaction,
  PermissionsBitField,
} from "discord.js";
import { CommandsV2 } from "../Maps/CommandMaps";
import Logger from "../System/Logger";
import { captureException } from "@sentry/node";
import { Mizuki } from "@system/Mizuki";
import { CommandGroups } from "../CommandInterface";

export default async (interaction: Interaction): Promise<void> => {
  if (interaction.isButton()) {
    handleButtonFunction(interaction);
  }

  if (interaction.isCommand()) {
    await handleSlashCommand(interaction);
  }
};

const logger = new Logger("Listeners/InteractionCreate");

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

  const slashCommand = CommandsV2.find((c) => c.data.name === interaction.commandName);
  let failedPermissionCheck = false;
  if (!slashCommand) {
    logger.error(
      `Could not find an interaction for ${interaction.commandName}`,
    );
    interaction.reply({ content: "An error has occurred" });
    return;
  }

  // Check if the user is the instance owner
  try {
    if (slashCommand.ownerOnly == true) {
      if (interaction.user.id !== Mizuki.instanceInfo.id) {
        interaction.reply({
          content:
            "Command failed to execute: This command is currently owner-only and is thus not available to be ran by anyone else (the description might tell you why its owner-only)",
          ephemeral: true,
        });
        return;
      }
    }
  } catch (err) {
    captureException(err)
    logger.error(
      `Command failed to execute: Failed to send the owner-only warning message ${err}`,
    );
  }

  // Check for permissions 
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
    captureException(err)
    logger.error(`Failed to check for permissions: ${err}`);
    await interaction.followUp({
      content: "Command failed to execute: Permission check failed",
    });
  }

  if (failedPermissionCheck === true) {
    return;
  }

  try {
    if (slashCommand.deferReply == true) {
      await interaction.deferReply({
        ephemeral: false,
      });
    }
  } catch (err) {
    captureException(err)
    logger.error(`Failed to defer-reply ${err}`);
    return;
  }

  try {
    const ERROR_MESSAGE = "This command has been disabled as per the demand of the instance owner, or as a result of a misconfiguration and Mizuki disabling it for them. Contact your instance owner for more details."
    if (slashCommand.groups != undefined) {
      if (
        Mizuki.disabledFeatures.datamining == true && slashCommand.groups.includes(CommandGroups.datamining)
        || Mizuki.disabledFeatures.regex == true && slashCommand.groups.includes(CommandGroups.regex)
      ) {
        if (slashCommand.deferReply == true) {
          await interaction.followUp(ERROR_MESSAGE)
        } else {
          await interaction.reply(ERROR_MESSAGE)
        }
      }

      return;
    }
  } catch (err) {
    const error = err as Error
    captureException(err)
    logger.error(`Failed to check if command is disabled ${error.message} - ${error.cause}`)
    return;
  }

  try {
    // it is currently 2:47 am and i dont want to deal with ts's bullshit
    // TODO: dont cast as any kthx
    await slashCommand.run(interaction as any);
  } catch (err) {
    const error = err as Error
    captureException(err)
    logger.error(
      `Command ${interaction.commandName} has ran into an error ${error.cause} - ${error.message}`,
    );

    logger.dumpLogsToDisk();
    const message =
      `Encountered an error while executing ${slashCommand.data?.name}! This error has been reported.`;

    if (slashCommand.deferReply == true) {
      try {
        await interaction.editReply({
          content: message,
        });
      } catch (err) {
        captureException(err)
        return;
      }
      return;
    }

    if (interaction.replied) {
      await interaction.editReply({ content: message });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
};
