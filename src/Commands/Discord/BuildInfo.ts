import { EmbedBuilder } from "@discordjs/builders";
import { DatabaseSystem } from "@system/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, type CommandInteraction, type ApplicationCommandType } from "discord.js";
import type { CommandV2 } from "../../CommandInterface";

type BuildStrings = { [key: string]: string }

export const BuildInfo: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("buildinfo")
    .setDescription("Displays info such as strings, experiments and etc for a build.")
    .addStringOption(option => option
      .setName("build")
      .setDescription("The build to check.")
      .setRequired(true)
    )
  //   .addStringOption(option => option
  //     .setName("branch")
  //     .setDescription("Required as some builds only exist on certain branches.")
  //     .addChoices(
  //       {
  //         name: "discord.com",
  //         value: DiscordBranch.Stable,
  //       },
  //       {
  //         name: "ptb.discord.com",
  //         value: DiscordBranch.PTB,
  //       },
  //       {
  //         name: "canary.discord.com",
  //         value: DiscordBranch.Canary,
  //       },
  //     )
  //     .setRequired(true))
  ,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const build = interaction.options.get("build")?.value as string
    // const branch = interaction.options.get("branch")?.value as DiscordBranch

    const buildData = await DatabaseSystem.getBuildData(build);

    if (buildData === undefined || buildData === null) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Build ${build} does not exist!`)
        ]
      })
      return;
    }

    // let strings = JSON.parse(buildData.Strings) as BuildStrings
    let experiments = buildData.experiments
    const embed = new EmbedBuilder()
      .setTitle(`Info for build ${build}`)
      .setColor(constants.colors.discord_blurple)


    // why is js so weirdddd sob
    // if (typeof strings === "string") {
    // strings = JSON.parse(strings)
    // }

    if (typeof experiments === "string") {
      experiments = JSON.parse(experiments)
    }

    const stringsCount = 0 // Object.values(strings).length
    const experimentsCount = experiments.size


    // if the build doesn't have a built-on date for whatever reason
    // then use the date we found it on instead.
    const date = buildData?.built_on || buildData.date_found

    embed.setFields(
      {
        name: "Strings",
        value: `${stringsCount.toString()} strings`,
        inline: true,
      },
      {
        name: "Experiments",
        value: `${experimentsCount.toString()} experiments`,
        inline: true,
      },
      {
        name: "Discovered",
        value: `<t:${date.getDate() / 1000}:R>`,
        inline: true,
      }
    )

    await interaction.followUp({ embeds: [embed] })
  },
};