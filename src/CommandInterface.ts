import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOption,
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  CommandInteractionOption,
} from "discord.js";
export type RunInteraction = CommandInteraction & ChatInputCommandInteraction

export interface APICommand extends ChatInputApplicationCommandData {
  deferReply?: boolean;
  ownerOnly?: boolean;
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  run: (interaction: RunInteraction) => void;
}

export type Command = {
  name: string;
  description: string,
  /**
 * @description In which "context" the command can be run in, e.g if it can be run in servers, the bot's DMs, or in GDMs/DMs
 */
  contexts?: CommandContextString | CommandContextSerialized,
  /**
  * @description i honestly forgot what this is
  */
  integration_types?: [0?, 1?],
  options: ApplicationCommandOption[],
  meta?: {
    deferReply?: boolean;
    /**
     * @description The permissions the runner must have to run the command 
     * */
    permissions?: bigint[];
    /**
    * @description Which servers the command should be available in (not defining this array will result in it being a global command)
    */
    servers?: string[];
    /**
    * @description if specified, locks the command to the specified User IDs. Use -1 to lock the command to the owner!
    */
    users?: string[];
  },
  run: (interaction: RunInteraction) => void;
}

export type CommandContext = "user" | "bot-dm" | "guild"
export type CommandContextString = [CommandContext?, CommandContext?]
export type CommandContextSerialized = [0?, 1?, 2?]

export const Commands = new Map<string, Command>();
export type LegacyCommand = CommandV2

export interface CommandV2 {
  data?: Omit<SlashCommandBuilder, any> & any | SlashCommandBuilder,
  deferReply?: boolean;
  ownerOnly?: boolean;
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  contexts?: CommandContextString | CommandContextSerialized,
  integration_types?: [0?, 1?],
  run: (interaction: RunInteraction) => void;
}

export function defineLegacyCommand(manifest: LegacyCommand) {
  const data = (manifest.data as SlashCommandBuilder).toJSON();
  const command: Command = {
    name: data.name,
    description: data.description,
    contexts: manifest.contexts,
    integration_types: manifest.integration_types,
    // eeevill.. but discord.js is also pretty evil :p
    options: data.options as ApplicationCommandOption[],
    meta: {
      deferReply: manifest.deferReply,
      permissions: manifest.permissions,
      servers: manifest.servers,
    },
    run: manifest.run
  }

  defineCommand(command);
}

export function defineCommand(manifest: Command) {
  if (Commands.get(manifest.name) != undefined) {
    throw new Error("Command already defined: " + manifest.name);
  }

  Commands.set(manifest.name, manifest);
}