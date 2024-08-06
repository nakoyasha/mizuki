import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
export type RunInteraction = CommandInteraction & ChatInputCommandInteraction

export interface Command extends ChatInputApplicationCommandData {
  deferReply?: boolean;
  ownerOnly?: boolean;
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  run: (interaction: RunInteraction) => void;
}

export type CommandContext = "user" | "bot-dm" | "guild"
export type CommandContextString = [CommandContext?, CommandContext?]
export type CommandContextSerialized = [0?, 1?, 2?]

export enum CommandGroups {
  datamining = "datamining",
  regex = "regex",
  serverSettings = "serverSettings",
}

export interface CommandV2 {
  data?: Omit<SlashCommandBuilder, any> & any | SlashCommandBuilder,
  deferReply?: boolean;
  ownerOnly?: boolean;
  groups?: CommandGroups[],
  // Permission bits. ex. PermissionBitField.Flags.KickMembers
  permissions?: bigint[];
  // Which servers the command should be available in (not defining this array will result in it being a global command)
  servers?: string[];
  contexts?: CommandContextString | CommandContextSerialized,
  integration_types?: [0?, 1?],
  run: (interaction: RunInteraction) => void;
}