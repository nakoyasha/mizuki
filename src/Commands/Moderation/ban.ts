import {
  ButtonBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
  PermissionsBitField,
  TextBasedChannel,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";

// TODO: merge kick and ban
export const ban: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the user from the server.")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to ban.")
      .setRequired(true))

    .addBooleanOption(option => option
      .setName("delete_message_history")
      .setDescription("Should the bot delete their message history?").
      setRequired(true))

    .addBooleanOption(option => option
      .setName("with_appeal")
      .setDescription("Should they be able to appeal the action?")
      .setRequired(true))

    .addStringOption(option => option
      .setName("reason").
      setDescription("For what reason should they be banned"))

    .addBooleanOption(option => option
      .setName("quiet")
      .setDescription("If enabled, the offender will not receive a DM from the bot telling them about their ban.")),
  permissions: [PermissionsBitField.Flags.BanMembers],
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const channel = (await interaction.guild?.channels.fetch(
      channels.shameCorner,
    )) as TextBasedChannel;
    const moderator = interaction.user;
    const delete_message_history = interaction.options.get(
      "delete_message_history",
    )?.value as number;
    const offender = interaction.options.getUser("user");
    const offenderMember = interaction.guild?.members.cache.get(
      offender?.id as string,
    ) as GuildMember;
    const banReason =
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
          `You have been banned from ${interaction.guild?.name} by ${moderator.username} for ${banReason}`,
        );
      }
      await offenderMember.ban({
        deleteMessageSeconds: delete_message_history || 0,
        reason: banReason,
      });

      const embed = new EmbedBuilder()
        .setFooter({
          text: moderator.username,
          iconURL: moderator.avatarURL() as string,
        })
        .setDescription(
          `${offender?.username} was banned by ${moderator.username} for ${banReason}`,
        );

      const message = await channel.send({ embeds: [embed] });
      message.react("💀");

      const unbanButton = new ButtonBuilder()
        .setCustomId(`unban${offender?.id}`)
        .setLabel("Unban user")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        unbanButton,
      );

      await interaction.reply({
        content: `Successfully banned ${offender?.username}. They have been DM'd about the ban.`,
        components: [row],
        ephemeral: true,
      });
    } catch (error) {
      const embed = MakeErrorEmbed(`Failed to ban user: ${error}`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
