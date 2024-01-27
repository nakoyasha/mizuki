import { Experiment, Experiments } from ".";

export interface ExperimentPuller {
  getClientExperiments(): Promise<Experiment[] | void | undefined>;
}