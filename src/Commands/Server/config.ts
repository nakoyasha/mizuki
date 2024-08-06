import { SlashCommandBuilder, CommandInteraction, Guild, TextChannel, ChatInputCommandInteraction } from "discord.js";
import { CommandGroups, CommandV2 } from "../../CommandInterface";
import { DatabaseSystem } from "@system/DatabaseSystem";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { GuildFeatures } from "@mizukiTypes/GuildData";

async function setGuildFeature(featureName: string, guild: Guild, value: boolean) {
  const guildData = await DatabaseSystem.getOrCreateGuildData(guild)
  const features = new Set(guildData?.features)

  // TODO: add other features

  if (value == true) {
    switch (featureName) {
      case GuildFeatures.AutoInvitesDisabler: {
        features.add(GuildFeatures.AutoInvitesDisabler)
      }
    }
  }

  if (value == false) {
    switch (featureName) {
      case GuildFeatures.AutoInvitesDisabler: {
        features.delete(GuildFeatures.AutoInvitesDisabler)
      }
    }
  }
  guildData.features = Array.from(features)

  await guildData?.save();
}

export const ServerSetup: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Server configuration")
    .addSubcommand(command => command
      .setName("config")
      .setDescription("Changes a server setting.")
      .addStringOption(option => option
        .setName("setting")
        .setDescription("Which setting to modify?")
        .setChoices({
          name: "Auto-invites disabler",
          value: "auto_disable_invites"
        },
          {
            name: "Regex-based replies enabled",
            value: "regex_replies"
          }
        )
      )
      .addBooleanOption(option => option
        .setName("value")
        .setDescription("What should the setting be set to?")
      )
    )
    .addSubcommand(command => command
      .setName("log-channel")
      .setDescription("Sets where Mizuki will send server logs.")
      .addChannelOption(option => option
        .setName("channel")
        .setDescription("What channel should become Mizuki's log channel?")
      )
    )
  ,
  deferReply: false,
  groups: [CommandGroups.serverSettings],
  run: async (interaction: ChatInputCommandInteraction) => {
    // TODO: figure out what the context enum means again
    if (interaction.guild == undefined) {
      await interaction.reply({
        embeds: [MakeErrorEmbed("This command cannot be ran outside of a server!")]
      })
      return;
    }
    const guild = interaction.guild
    const subCommand = interaction.options.getSubcommand()

    switch (subCommand) {
      case "config":
        const optionName = interaction.options.get("setting")?.value as string
        const prefereedValue = interaction.options.get("value")?.value as boolean


        setGuildFeature(optionName, guild, prefereedValue)
        await interaction.reply(`Set **${optionName}** to ${prefereedValue}`)
        break;
      case "log-channel":
        const channel = interaction.options.get("channel")?.channel as TextChannel
        const guildData = await DatabaseSystem.getOrCreateGuildData(guild)

        guildData.log_channel = channel.id
        await guildData.save()
        await interaction.reply(`Set **log_channel** to <#${channel.id}>`)
    }
  },
};