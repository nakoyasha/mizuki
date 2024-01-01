import {
  CommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../CommandInterface";

import axios from "axios";
import resolve_srs_asset from "../../resolveSRSAsset";
import { EmbedBuilder } from "@discordjs/builders";

function resolveChannelLink(BinaryType: any, ChannelName: any) {
  return (
    "https://clientsettings.roblox.com/v2/client-version/" +
    BinaryType +
    "/channel/" +
    ChannelName
  );
}

async function getChannelInfo(BinaryType: any, ChannelName: any) {
  try {
    const response = await axios.get(
      resolveChannelLink(BinaryType, ChannelName),
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failure to get channel info:");
  }
}

export const GetChannelInfo: Command = {
  name: "get-channel-info",
  options: [
    {
      name: "binarytype",
      description: "The platform the channel is for.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
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
      ],
    },
    {
      name: "channel",
      description: "The channel to get info for.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  description: "Gets info for a Roblox release channel.",
  type: ApplicationCommandType.ChatInput,
  ownerOnly: true,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const binaryType: any = interaction.options.get("binarytype")?.value;
    const channel: any = interaction.options.get("channel")?.value;

    //try {
    const data = await getChannelInfo(binaryType, channel);
    const embed = new EmbedBuilder();
    console.log(data);
    const version = data["version"];
    const clientVersionUpload = data["clientVersionUpload"];
    const bootStrapperVersion = data["bootstrapperVersion"];
    console.log(version + clientVersionUpload + bootStrapperVersion);

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
    // } catch (err) {
    //     console.log("did we error again? the fuck?" + err)
    //     // await interaction.followUp({
    //     //     ephemeral: true,
    //     //     content: "Failed to get channel info (does the channel exist?)"
    //     // })
    // }
  },
};
