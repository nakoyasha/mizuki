import {
  ButtonBuilder,
  GuildMember,
  PermissionsBitField,
  TextBasedChannel,
  ButtonStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";
import { channels } from "../../Maps/ChannelsMap";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "../../Util/MakeErrorEmbed";
import { Mizuki } from "@system/Mizuki";
import Emojis from "@maps/EmojisMap";

export const moderate: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("moderate")
    .setDescription("Moderates the user.")

    // ban subcommand
    .addSubcommand(command => command
      .setName("ban")
      .setDescription("Bans the user from the server.")
      .addUserOption(option => option
        .setName("user")
        .setDescription("The user to ban."))

      .addBooleanOption(option => option
        .setName("with_appeal")
        .setDescription("Should they be able to appeal the action?"))

      .addStringOption(option => option
        .setName("reason").
        setDescription("For what reason should they be banned?"))

      .addBooleanOption(option => option
        .setName("message")
        .setDescription("Should the bot notify them about the ban?"))
    )

    // kick subcommand
    .addSubcommand(command => command
      .setName("kick")
      .setDescription("Kicks the user from the server.")
      .addUserOption(option => option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true))

      .addBooleanOption(option => option
        .setName("with_appeal")
        .setDescription("Should they be able to appeal the action?"))

      .addStringOption(option => option
        .setName("reason").
        setDescription("For what reason should they be kicked?"))

      .addBooleanOption(option => option
        .setName("message")
        .setDescription("Should the bot message them about the kick?")),
    ),
  permissions: [PermissionsBitField.Flags.BanMembers],
  deferReply: true,
  run: async (interaction: ChatInputCommandInteraction) => {
    const subCommand = interaction.options.getSubcommand()
    const moderator = interaction.user;
    const offender = interaction.options.getUser("user");
    const offenderMember = interaction.guild?.members.cache.get(offender?.id as string,)
    const botMember = interaction.guild?.members.cache.find((member) => member.id == Mizuki.client.user?.id)

    const reason =
      (interaction.options.get("reason")?.value as string) ||
      "No reason specified";
    const shouldDM = interaction.options.get("message")?.value as boolean;

    // TODO: implement a way to set the shame channel
    // const channel = (await interaction.guild?.channels.fetch(
    //   channels.shameCorner,
    // )) as TextBasedChannel;


    if (offenderMember == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed("Unknown user")
        ]
      })
      return;
    }

    // ...why would you do this?
    if (offenderMember.id == botMember?.id) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't moderate myself, sorry!! ${Emojis.blobcatcozy}`)
        ]
      })
      return;
    }

    if (!botMember?.permissions.has("BanMembers") || !botMember?.permissions.has("KickMembers")) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't moderate this user as I lack the \"Ban Members\" or the \"Kick Members\" permission.\nPlease grant me those permissions before using the moderate command ${Emojis.blobcatcozy}`)
        ],
        files: [
          new AttachmentBuilder("assets/errors/no_moderate_perms.png"),
        ]
      })
      return;
    }

    // check if the bot can ban/kick
    if (!offenderMember.bannable || !offenderMember.kickable) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`I can't moderate this user as they have a higher role ${Emojis.blobcatcozy}`)
        ]
      })
      return;
    }


    if (moderator == offender) {
      if (!botMember?.permissions.has("BanMembers") || !botMember?.permissions.has("KickMembers")) {
        await interaction.followUp({
          embeds: [
            MakeErrorEmbed(`you can't moderate yourself silly ${Emojis.blobcatcozy}`)
          ],
        })
        return;
      }
      return;
    }

    const action = subCommand == "ban" && "banned" || "kicked"
    const actionFail = subCommand == "ban" && "ban" || "kick"

    try {

      // TODO: figure out why the DM sometimes isn't sent
      if (shouldDM == true) {
        await offenderMember.send(
          `You have been ${action} from ${interaction.guild?.name} by ${moderator.username} for ${reason}`,
        );
      }

      if (subCommand == "ban") {
        await offenderMember.ban({
          //deleteMessageSeconds: delete_message_history && 60 || 0,
          reason: reason,
        });
      } else if (subCommand == "kick") {
        await offenderMember.kick(reason)
      }

      // const embed = new EmbedBuilder()
      //   .setFooter({
      //     text: moderator.username,
      //     iconURL: moderator.avatarURL() as string,
      //   })
      //   .setDescription(
      //     `${offender?.username} was ${action} by ${moderator.username} for "${reason}"`,
      //   );

      // const message = await channel.send({ embeds: [embed] });
      // message.react("💀");

      let components = [] as any[]

      if (subCommand == "ban") {
        const unbanButton = new ButtonBuilder()
          .setCustomId(`unban${offender?.id}`)
          .setLabel("Unban user")
          .setStyle(ButtonStyle.Danger);

        components = [new ActionRowBuilder<ButtonBuilder>().addComponents(
          unbanButton,
        )]
        console.log("yayayayaya (ban)")
      }

      await interaction.followUp({
        content: `Successfully ${action} ${offender?.username}. They have been DM'd about the ${actionFail}`,
        components: components,
        ephemeral: true,
      });

    } catch (error) {
      console.log("yayayayaya")
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Failed to ${actionFail} user: ${error}`)
        ]
      });
    }
  },
};
