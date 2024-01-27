import { DiscordBranch } from "@mizukiTypes/DiscordBranch";
import { Experiment, Experiments } from ".";

export interface ExperimentPuller {
  getClientExperiments(branch: DiscordBranch): Promise<Experiment[] | void | undefined>;
}