import { Experiment, Experiments } from ".";

export class ExperimentPuller {
  async getClientExperiments(): Promise<Experiment[] | void | undefined> { };
}