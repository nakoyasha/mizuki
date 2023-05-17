import { Command } from "../CommandInterface";
import { SRSGet } from "./SRSGet";
import { ResolveAsset } from "./ResolveAsset";
import { GetChannelInfo } from "./GetChannelInfo";

export const Commands: Command[] = [SRSGet, ResolveAsset, GetChannelInfo];