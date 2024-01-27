import mongoose from "mongoose";
import { Experiment, MinExperiment } from "@util/PullExperimentData";
import { DiscordBranch } from "./DiscordBranch";

export type BuildData = {
  _id?: mongoose.Schema.Types.ObjectId;
  BuildNumber: string,
  VersionHash: string,
  Date: Number,
  Branch: DiscordBranch,
  Strings: string,
  Experiments: string,
};
