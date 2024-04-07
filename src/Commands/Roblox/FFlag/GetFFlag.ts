// make a mizuki command that uses clientsettingspuller to get a fflag based on the option name and display it as an discordjs embed
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "../../../CommandInterface";
import { RobloxApplication } from "@util/RobloxTracker/Types/RobloxApplication";
import { ClientSettingsFetcher } from "@util/RobloxTracker/ClientSettingsFetch";
import { EmbedBuilder } from "@discordjs/builders";
import { FFlagType } from "@util/RobloxTracker/Types/FFlagType";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";

const fetcher = new ClientSettingsFetcher()

export const GetFFlag: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("get-fflag")
    .setDescription("Gets information about a Roblox FFlag")
    .addStringOption(option => option
      .setName("application-type")
      .setDescription("Which application to get the FFlag from")
      .setRequired(true)
      .setChoices(
        {
          name: "PC Desktop Client",
          value: RobloxApplication.PCDesktopClient,
        },

        {
          name: "PC Studio",
          value: RobloxApplication.PCStudioApp,
        },
      )
    )
    .addStringOption(option => option
      .setName("fflag")
      .setDescription("What FFlag to get?")
      .setRequired(true)
    ),
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const application: RobloxApplication = interaction.options.get("application-type")?.value as RobloxApplication;
    const fflagName: string = interaction.options.get("fflag")?.value as string;

    try {
      const fflag = await fetcher.getFFlag(application, fflagName)
      const fflagValue = fflag.value
      const isArray = Array.isArray(fflagValue)

      let fflagType = "Fast Flag"

      if (fflag.type == FFlagType.DynamicFlag) {
        fflagType = "Dynamic Flag"
      } else if (fflag.type == FFlagType.SynchronizedFast) {
        fflagType = "Synchronized Fast"
      }

      const embed = new EmbedBuilder()
      embed.setFooter({
        text: "⚠️ The FFlag value may exceed the 25 field limit and be truncated.",
        iconURL: constants.icons.roblox,
      })

      embed.setColor(constants.colors.roblox_white)
      embed.addFields({
        name: "Name",
        value: fflagName,
        inline: true,
      })

      embed.addFields({
        name: "Type",
        value: fflagType,
        inline: true,
      })

      if (isArray === true) {
        // truncate it!
        if (fflagValue.length > 25) {
          fflagValue.length = 23
        }

        fflagValue.forEach(value =>
          embed.addFields(
            {
              name: "Value",
              value: value,
              inline: true,
            })
        )
      } else {
        embed.addFields({
          name: "Value",
          value: fflag.value,
          inline: true,
        })
      }

      await interaction.followUp({ embeds: [embed] })
      // ts won't let me use the error type here :airicry:
    } catch (err: any) {
      const embed = MakeErrorEmbed(err.toString())
      await interaction.followUp({ embeds: [embed] })
    }
  },
};
