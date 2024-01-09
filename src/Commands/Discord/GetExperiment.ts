import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import MakeErrorEmbed from "@util/MakeErrorEmbed";
import { ChatInputCommandInteraction } from "discord.js";
import puppeteer from "puppeteer";
import { CommandV2 } from "src/CommandInterface";
import { Experiment, Experiments, GuildExperiment, UserExperimentAssignment, getExperiments } from "src/Util/PullExperimentData";


let experimentsCache: any & Experiments = undefined;

export const GetExperiment: CommandV2 = {
  // TODO: remind me to refactor every command to use slashcommandbuilder instead kthx tyy
  data: new SlashCommandBuilder()
    .setName("getexperiment")
    .setDescription("Gets Info about a Discord Experiment")
    .addStringOption(option => option
      .setName("hash")
      .setDescription("This can either be the human readable name of the experiment or a hash (ex. 4130837190)")
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName("id")
      .setDescription("The user id to pull bucket info for (by default, this will use your user id)")
      .setRequired(false)
    )
  ,
  deferReply: true,
  ownerOnly: true,
  run: async (interaction: ChatInputCommandInteraction) => {
    const hash_key = interaction.options.get("hash")?.value as string
    const overrideRequester = interaction.options.get("id")?.value as string
    const experiments = experimentsCache as Experiments || await getExperiments()

    // cache init
    if (experimentsCache != experiments) {
      console.log("Rebuilding cache");
      experimentsCache = experiments;
    }

    let experiment: Experiment | undefined = experiments.user.find((experiment) => experiment.name == hash_key)

    if (experiment == undefined) {
      const errorEmbed = MakeErrorEmbed("No such experiment exists")
      await interaction.followUp({ embeds: [errorEmbed] })
      return;
    }

    const experimentName = experiment.title as string
    const assignment = experiment.assignment

    const overrides = experiment.description.filter((override) => override != "Not Eligible" && override != "Control Bucket")
    const formattedOverrides = [] as string[]
    const formattedPopulations = [] as string[]

    let requester;

    switch (experiment.type) {
      case "user":
        requester = interaction.user.id;
      case "guild":
        requester = interaction.guildId;

        // get populations and range 
        const populations = (assignment as GuildExperiment)?.populations
        console.log(assignment)
        if (populations != undefined) {
          populations.forEach(population => {
            console.log(population.ranges)
            let populationString = `Population ${formattedPopulations.length} 
            ${population.ranges[0].rollout.s} - ${population.ranges[0].rollout.e}
            `
            const guildHasFeatures = population.filters?.guild_has_features
            const guildIdRange = population.filters?.guild_id_range
            const guildMemberCountRange = population.filters?.guild_member_count_range
            const guildIds = population.filters?.guild_ids
            const guildHubTypes = population.filters?.guild_hub_types
            const guildHasVanityUrl = population.filters?.guild_has_vanity_url
            const guildInRangeByHash = population.filters?.guild_in_range_by_hash

            console.log(guildHasFeatures, guildIdRange, guildMemberCountRange, guildHubTypes, guildHasVanityUrl, guildInRangeByHash)
            if (guildHasFeatures != undefined) {
              populationString + `Guild must have ${guildHasFeatures.guild_features.join(",")} features\n`
            } else if (guildIdRange != undefined) {
              populationString + `Guild must be in the ${guildIdRange.min_id} - ${guildIdRange.max_id} id range\n`
            } else if (guildMemberCountRange != undefined) {
              populationString + `Guild must be in the ${guildMemberCountRange.min_id} - ${guildMemberCountRange.max_id} id range\n`
            } else if (guildIds != undefined) {
              populationString + `Guild must be manually added into the population`
            } else if (guildHubTypes != undefined) {
              populationString + `Guild must be one of the following types: [${guildHubTypes.guild_hub_types.join(",")}]\n`
            } else if (guildHasVanityUrl != undefined) {
              populationString + "Guild must have a vanity URL"
            } else if (guildInRangeByHash != undefined) {
              populationString + ""
            }
            formattedPopulations.push(populationString)
          })

        }
      default:
        requester = interaction.guildId;
    }

    overrides.forEach(override => {
      formattedOverrides.push(override)
      switch (experiment?.type) {
        case "guild":
          break;
      }
    })

    const embed = new EmbedBuilder()
      .setColor([88, 101, 242])
      .setTitle(`${experiment.type == "guild" && "🏢" || "👤"} Experiment Info for ${experimentName}`)
      .setDescription(
        // :airicrying:
        `${experiment.type == "user" && "**This experiment has no rollout data as its a user experiment**\n" || ""}
      **Populations:**\n${formattedPopulations.join("\n")}  
      **Overrides:**\n${formattedOverrides.join("\n")}
      `)
      .addFields(
        {
          name: "Hash",
          value: experiment.hash.toString(),
          inline: true,
        })
      .addFields(
        {
          name: "Hash Key",
          value: experiment.hash_key as string,
          inline: true,
        })
      .addFields(
        {
          name: "Is an AA Experiment",
          value: experiment?.aa_mode == true && "Yes" || "No",
          inline: true,
        })
      .setURL(`https://nelly.tools/experiments/${experiment.hash}`)

    await interaction.followUp({ embeds: [embed] });
  }
};