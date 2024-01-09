import {
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
  PermissionsBitField,
  TextBasedChannel,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

// TODO: merge kick and ban
export const kick: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the user from the server.")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to kick.")
      .setRequired(true))

    .addBooleanOption(option => option
      .setName("delete_message_history")
      .setDescription("Should the bot delete their message history?")
      .setRequired(true))

    .addBooleanOption(option => option
      .setName("with_appeal")
      .setDescription("Should they be able to appeal the action?")
      .setRequired(true))

    .addStringOption(option => option
      .setName("reason")
      .setDescription("For what reason should they be kicked?"))

    .addBooleanOption(option => option
      .setName("quiet")
      .setDescription("If enabled, the offender will not receive a DM from the bot telling them about their ban.")
    ),
  permissions: [PermissionsBitField.Flags.KickMembers],
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const channel = (await interaction.guild?.channels.fetch(
      channels.shameCorner,
    )) as TextBasedChannel;
    const moderator = interaction.user;
    const offender = interaction.options.getUser("user");
    const offenderMember = interaction.guild?.members.cache.get(
      offender?.id as string,
    ) as GuildMember;
    const kickReason =
      (interaction.options.get("reason")?.value as string) ||
      "No reason specified";
    const shouldDM = interaction.options.get("quiet")?.value as boolean;

    if (moderator == offender) {
      await interaction.reply("Are you stupid?");
      return;
    }

    try {
      if (shouldDM == true) {
        await offenderMember.send(
          `You have been kicked from ${interaction.guild?.name} by ${moderator.username} for ${kickReason}`,
        );
      }
      await offenderMember.kick(kickReason);

      const embed = new EmbedBuilder()
        .setFooter({
          text: moderator.username,
          iconURL: moderator.avatarURL() as string,
        })
        .setDescription(
          `${offender?.username} was kicked by ${moderator.username} for ${kickReason}`,
        );

      const message = await channel.send({ embeds: [embed] });
      message.react("💀");

      await interaction.reply({
        content: `Successfully kicked ${offender?.username}. They have been DM'd about the kick.`,
        ephemeral: true,
      });
    } catch (error) {
      const embed = MakeErrorEmbed(`Failed to kick user: ${error}`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
