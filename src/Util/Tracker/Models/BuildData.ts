import { Schema, model } from "mongoose";
import { BuildData } from "@util/Tracker/Types/BuildData";

export const BuildSchema = new Schema<BuildData>({
  BuildNumber: String,
  VersionHash: String,
  Date: Number,
  // TODO: propery store strings and experiments
  Strings: String,
  Branch: String,
  Experiments: String,
});

export const BuildModel = model("Build", BuildSchema, "MizukiBuilds");
