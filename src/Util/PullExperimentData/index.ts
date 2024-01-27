// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios"
import { PuppeteerPull } from "./PuppeteerPull";
import murmurhash from "murmurhash";
import Logger from "@system/Logger";
import { ASTPuller } from "./ASTPuller";

const logger = new Logger("PullExperimentData")

export type Snowflake = string;

export type ExperimentPopulationGuildFeatureFilter = {
  guild_features: string[],
}

export type ExperimentPopulationRangeFilter = {
  min_id?: Snowflake,
  max_id?: Snowflake,
}

export type ExperimentPopulationIDFilter = {
  guild_ids: Snowflake[],
}

export type ExperimentPopulationHubTypeFilter = {
  guild_hub_types: number[]
}

export type ExperimentPopulationVanityFilter = {
  guild_has_vanity_url: boolean,
}

export type ExperimentPopulationHash = {
  hash_key: number,
  target: number,
}
export type ExperimentPopulationRollout = {
  // Range start
  s: number,
  // Range end
  e: number
}

export type ExperimentPopulationRange = {
  bucket: number,
  rollout: ExperimentPopulationRollout
}

export type ExperimentPopulationFilters = {
  guild_has_feature?: ExperimentPopulationGuildFeatureFilter,
  guild_id_range?: ExperimentPopulationRangeFilter,
  guild_member_count_range?: ExperimentPopulationRangeFilter,
  guild_ids?: ExperimentPopulationIDFilter,
  guild_hub_types?: ExperimentPopulationHubTypeFilter,
  guild_has_vanity_url?: ExperimentPopulationVanityFilter,
  guild_in_range_by_hash?: ExperimentPopulationHash,
}

/* 
 taken from userdocs:

 This filter is used to limit rollout position by an additional hash key. 
 The calculated rollout position must be less than the given target. 
 The rollout position can be calculated using the following pseudocode, 
 where hash_key is the provided hash key and resource_id is the guild ID:
```py
  hashed = mmh3.hash('hash_key:resource_id', signed=False)
  if hashed > 0:
      # Double the hash
      hashed += hashed
  else:
      # Unsigned right shift by 0
      hashed = (hashed % 0x100000000) >> 0
  result = hashed % 10000
 ```
*/

export type ExperimentPopulation = {
  ranges: ExperimentPopulationRange[],
  filters: ExperimentPopulationFilters,
}

/* 
  An override represents a manual setting by Discord staff to grant a resource early or 
  specific access to an experiment. 
  Contrary to what you'd expect, guild experiments can be and are often overriden 
  and assigned to a user ID.

  Example
  {
    "b": 1,
    "k": ["882680660588904448", "882703776794959873", "859533785225494528", "859533828754505741"]
  }
*/
export type ExperimentBucketOverride = {
  // Bucket assigned to these resouces
  b: number,
  // Resources granted access to this bucket 
  k: Snowflake[]
}

/*

  1 Failure to meet the holdout experiment's requirements will result in a bucket of None (-1).
  2 The bucket for A/A tested experiments should always be None (-1).

*/
export type GuildExperiment = {
  hash: number,
  hash_key?: string,
  revision: number,
  populations: ExperimentPopulation[]
  overrides: ExperimentBucketOverride[],
  overrides_formatted: ExperimentPopulation[][]
  holdout_name?: string;
  holdout_bucket?: number,
  aa_mode: boolean,
}

export type UserExperimentAssignment = {
  hash: number,
  // TODO: implement getting the hash key lmao
  hash_key?: string,
  revision: number,
  bucket: number | -1,
  override: number,
  population: number,
  hash_result: number,
  aa_mode: boolean,
}

export type ExperimentsHttpResult = {
  fingerprint?: string
  assignments: UserExperimentAssignment[];
  guild_experiments: GuildExperiment[];
}

function processEdgeOFPopulationRange(WeirdBucket: any[]) {
  const bucket = WeirdBucket[0]
  const ranges = WeirdBucket[1][0]

  return {
    bucket: bucket as number,
    rollout: {
      s: ranges.s as number,
      e: ranges.e as number,
    },
  }
}

function processPopulationRange(PopulationRange: any[]) {
  const bucket = PopulationRange?.[0]
  const ranges = PopulationRange?.[1]

  if (bucket instanceof Object && ranges == undefined) {
    return processEdgeOFPopulationRange(bucket)
  }

  return {
    bucket: bucket as number,
    rollout: {
      s: PopulationRange[1][0].s as number,
      e: PopulationRange[1][0].e as number,
    },
  }
}

function processPopulationRanges(PopulationRanges: any[]) {
  const ranges = [] as any[]

  PopulationRanges.forEach(range => {
    // :airidizzy:
    ranges.push(processPopulationRange(range))
  })


  // there are no ranges, so skip them entirely
  // if (bucket == undefined || ranges == undefined) {
  //   return {
  //     bucket: null,
  //     rollout: {
  //       s: null,
  //       e: null,
  //     }
  //   }
  // }



  return [...ranges]
}

function processPopulationFilters(PopulationFilters: any[]) {
  const filters = PopulationFilters[0]?.[1]?.[0]
  if (filters == undefined) {
    return {}
  }
  return {
    guild_has_feature: {
      guild_features: filters?.[1]
    },
    guild_id_range: {
      min_id: filters?.[2] as Snowflake,
      max_id: filters?.[3] as Snowflake,
    },
    guild_member_count_range: {
      min_id: filters?.[4] as Snowflake,
      max_id: filters?.[5] as Snowflake,
    },
    guild_ids: {
      guild_ids: filters?.[6] as Snowflake[0]
    },
    guild_hub_types: {
      guild_hub_types: filters?.[7] as number[]
    },
    guild_has_vanity_url: {
      guild_has_vanity_url: filters?.[8] as boolean,
    },
    guild_in_range_by_hash: {
      hash_key: filters?.[9] as number,
      target: filters?.[10] as number,
    },
  }
}

function processPopulations(Populations: any[]) {
  let populations = [] as ExperimentPopulation[]

  Populations.forEach(rawPopulation => {
    let ranges = rawPopulation[0]
    let filters = rawPopulation[1]

    const data = {
      ranges: ranges != undefined && processPopulationRanges(rawPopulation[0]) || null,
      filters: filters != undefined && processPopulationFilters(rawPopulation[1]) || null
    }
    populations.push(data as any)
  })

  //console.log(populations)

  return populations
}

function processOverrides(Overrides: any[]) {
  let overrides = [] as ExperimentBucketOverride[]

  Overrides.forEach(rawOverride => {
    const data = {
      b: rawOverride?.[0] as number,
      k: rawOverride?.[1] as Snowflake[],
    }
    Overrides.push(data as any)
  })

  return overrides
}

function processUserAssignment(UserAssignment: any[]) {
  return {
    hash: UserAssignment[0],
    revision: UserAssignment[1],
    bucket: UserAssignment[2],
    override: UserAssignment[3],
    population: UserAssignment[4],
    hash_result: UserAssignment[5],
    aa_mode: Boolean(UserAssignment[6]),
  } as UserExperimentAssignment
}

function processGuildExperiment(GuildExperiment: any[]) {
  return {
    hash: GuildExperiment[0] as number,
    hash_key: GuildExperiment[1] as string,
    revision: GuildExperiment[2] as number,
    populations: processPopulations(GuildExperiment[3]),
    overrides: processOverrides(GuildExperiment[4]),
    overrides_formatted: [processPopulations(GuildExperiment[5])],
    holdout_name: GuildExperiment[6] as string,
    holdout_bucket: GuildExperiment[7] as number,
    aa_mode: Boolean(GuildExperiment[8]),
  } as GuildExperiment
}

export type Experiment = {
  hash_key?: string,
  name: string,
  // The 32-bit hash of the experiment name
  hash: number,
  buckets: number[],
  // The names for the buckets (aka treatments)
  description: string[],
  title: string,
  type: "user" | "guild",
  revision: number,
  assignment?: UserExperimentAssignment | GuildExperiment,
  // The requester's rollout position in the experiment.
  rollout_position: number,
  aa_mode: boolean,
}

export type Experiments = {
  assignments: UserExperimentAssignment[],
  user: Experiment[],
  guild: GuildExperiment[],
}

export async function getExperiments(resource_id?: string) {
  try {
    const experimentsResult = await axios.get("https://discord.com/api/v9/experiments?with_guild_experiments=true", {
      // headers: {
      //   "X-Fingerprint": fingerprint
      // }
    })

    const body = experimentsResult.data as ExperimentsHttpResult

    if (body.fingerprint != null) {
      console.warn("We performed an unauth'd get_experiments call, assignment results may be inaccurate !!")
    }

    const experiments = {
      assignments: [],
      user: [],
      guild: [],
    } as Experiments

    body.assignments.forEach(userAssignment => {
      const experiment = processUserAssignment(userAssignment as any)
      experiments.assignments.push(experiment)
    })

    for (let guildExperiment of body.guild_experiments) {
      // const earlyHash = (guildExperiment as any)[0]
      const experiment = processGuildExperiment(guildExperiment as any)

      if (experiment.hash_key != null) {
        // typescript doesnt like me casting it as a string here... for some reason?
        // soo weird 
        experiments.guild.push(experiment)
      }
    }

    // pull client experiments last, as its unreliable/slow and :yesyesyes:

    // ts devs smoke weed before working on it i swear
    // @ts-ignore
    const clientExperiments = await getClientExperiments("ast")

    // @ts-ignore
    Object.entries(clientExperiments).forEach(([experiment_name, experiment]) => {
      if (experiment_name == undefined) {
        // no idea what causes this..
        return;
      }

      const hash = murmurhash(experiment_name)
      const experimentAssignment =
        experiments.guild.find((experiment) => experiment.hash == hash)

      if (experimentAssignment == undefined) {
        logger.warn(`Experiment ${experiment_name} has no server data!`)
      }

      // // auto-correct. yayaya
      // if (experimentAssignment != undefined) {
      //   if (experiment.name != experimentAssignment.hash_key) {

      //   }
      // }

      const rolloutPosition = murmurhash(`${experiment_name}:${resource_id}`) % 10000

      const properExperimentObject = {
        // alias because i cant be bothered to fix types :airicry:

        // either the server, or the client one
        hash_key: experimentAssignment?.hash_key || experiment.hash_key,
        name: experiment_name,
        hash: hash,
        buckets: experiment.buckets,
        title: experiment.title,
        description: experiment.description,
        assignment: experimentAssignment,
        type: experiment.type,
        revision: experimentAssignment?.revision as number,
        rollout_position: rolloutPosition,
        aa_mode: experimentAssignment?.aa_mode as boolean,
      } as Experiment

      experiments.user.push(properExperimentObject)
    })

    return experiments
  } catch (err) {
    logger.error(`Error while pulling experiments: ${err}`)
    throw err;
  }
}

// Performs a (proper) pull on client experiments, which results in hash_key, and the proper name being available.
// tl;dr:
// ast - fast, but unreliable
// puppeter - slow, but reliable
export function getClientExperiments(type: "puppeteer" | "ast") {
  switch (type) {
    case "puppeteer":
      return new PuppeteerPull().getClientExperiments()
    case "ast":
      // TODO: implement scripts
      return new ASTPuller().getClientExperiments()
  }
}

