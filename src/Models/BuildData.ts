import { Schema, model } from "mongoose";
import { BuildData } from "@mizukiTypes/BuildData";

const experiment = {
  hash_key: { type: String, required: false },
  name: String,
  hash: Number,
  buckets: { type: [Number], required: true },
  description: { type: [String], required: true },
  title: String,
  type: String,
}

export const BuildSchema = new Schema<BuildData>({
  _id: Schema.Types.ObjectId,
  BuildNumber: String,
  VersionHash: String,
  Date: Number,
  // TODO: propery store strings and experiments
  Strings: String,
  Branch: String,
  Experiments: String,
});

export const BuildModel = model("Build", BuildSchema, "MizukiBuilds");
