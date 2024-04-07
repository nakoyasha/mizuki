import {
  CommandInteraction,
} from "discord.js";
import { CommandV2 } from "../../../CommandInterface";
import axios from "axios";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import * as Sentry from "@sentry/node"

function resolveChannelLink(BinaryType: string, ChannelName: string) {
  return (
    "https://clientsettings.roblox.com/v2/client-version/" +
    BinaryType +
    "/channel/" +
    ChannelName
  );
}

async function getChannelInfo(BinaryType: string, ChannelName: string) {
  try {
    const response = await axios.get(
      resolveChannelLink(BinaryType, ChannelName),
    );
    return response.data;
  } catch (err) {
    Sentry.captureException(err)
    console.log(err);
    throw new Error("Failure to get channel info:");
  }
}

export const GetChannelInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("get-roblox-channel-info")
    .setDescription("Gets info for a Roblox release channel. (obsolete now!)")
    .addStringOption(option => option
      .setName("binarytype")
      .setDescription("The platform the channel is for")
      .addChoices(
        {
          name: "Windows",
          value: "WindowsPlayer",
        },
        {
          name: "Windows Studio",
          value: "WindowsStudio",
        },
        {
          name: "Mac",
          value: "MacPlayer",
        },
        {
          name: "Mac Studio",
          value: "MacStudio",
        },
      )
      .setRequired(true))
    .addStringOption(option => option
      .setName("channel")
      .setDescription("The channel to get info for.")
      .setRequired(true))
  ,
  ownerOnly: true,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const binaryType = interaction.options.get("binarytype", true)
      ?.value as string;
    const channel = interaction.options.get("channel", true)?.value as string;

    //try {
    const data = await getChannelInfo(binaryType, channel);
    const embed = new EmbedBuilder();
    const version = data["version"];
    const clientVersionUpload = data["clientVersionUpload"];
    const bootStrapperVersion = data["bootstrapperVersion"];

    embed.setTitle(channel);
    embed.setURL(resolveChannelLink(binaryType, channel));
    embed.setFields([
      {
        name: "Version",
        value: version,
        inline: true,
      },
      {
        name: "Version-ID",
        value: clientVersionUpload,
        inline: true,
      },
      {
        name: "Bootstrapper Version",
        value: bootStrapperVersion,
        inline: true,
      },
    ]);

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });
  },
};
