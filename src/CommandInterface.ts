import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  SlashCommandBuilder,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
export type RunInteraction = CommandInteraction & ChatInputCommandInteraction

export interface Command extends ChatInputApplicationCommandData {
  // WIP REFACTOR
  data?: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
  deferReply?: boolean;
  ownerOnly?: boolean;
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  run: (interaction: RunInteraction) => void;
}


export interface CommandV2 {
  data?: Omit<SlashCommandBuilder, any> & any,
  deferReply?: boolean;
  ownerOnly?: boolean;
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  run: (interaction: RunInteraction) => void;
}