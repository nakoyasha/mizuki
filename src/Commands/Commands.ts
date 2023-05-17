import { Command } from "../CommandInterface";
import { SRSGet } from "./SRSGet";
import { ResolveAsset } from "./ResolveAsset";

export const Commands: Command[] = [SRSGet, ResolveAsset];