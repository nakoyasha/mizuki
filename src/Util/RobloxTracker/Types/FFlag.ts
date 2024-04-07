import { FFlagType } from "./FFlagType";

export type FFlag = {
  name: string;
  type?: FFlagType;
  value: any;
}