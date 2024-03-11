import { EmbedBuilder } from "@discordjs/builders";
import { DiscordBranch } from "@util/Tracker/Types/DiscordBranch";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { constants } from "@util/Constants";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { SlashCommandBuilder, CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandV2 } from "src/CommandInterface";
import { MinExperiment } from "@util/Tracker/Types/Experiments";

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
    .addStringOption(option => option
      .setName("branch")
      .setDescription("Required as some builds only exist on certain branches.")
      .addChoices(
        {
          name: "discord.com",
          value: "stable",
        },
        {
          name: "ptb.discord.com",
          value: "ptb",
        },
        {
          name: "canary.discord.com",
          value: "canary",
        },
      )
      .setRequired(true))
  ,
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const build = interaction.options.get("build")?.value as string
    const branch = interaction.options.get("branch")?.value as DiscordBranch

    const buildData = await DatabaseSystem.getBuildData(build, branch);

    if (buildData == undefined) {
      await interaction.followUp({
        embeds: [
          MakeErrorEmbed(`Build ${origin} does not exist on ${branch}`)
        ]
      })
      return;
    }
    let strings = JSON.parse(buildData.Strings) as BuildStrings
    let experiments = buildData.Experiments
    const embed = new EmbedBuilder()
      .setTitle(`Info for build ${build} on ${branch}`)
      .setColor(constants.colors.discord_blurple)


    // why is js so weirdddd sob
    if (typeof strings == "string") {
      strings = JSON.parse(strings)
    }

    if (typeof experiments == "string") {
      experiments = JSON.parse(experiments)
    }

    const stringsCount = Object.values(strings).length
    const experimentsCount = experiments.size

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
        value: `<t:${buildData.Date}:R>`,
        inline: true,
      }
    )

    await interaction.followUp({ embeds: [embed] })
  },
};