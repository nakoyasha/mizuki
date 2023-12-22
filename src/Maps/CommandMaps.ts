import { Command } from "../CommandInterface";
import { SRSGet } from "../Commands/Hoyoverse/SRSGet";
import { ban } from "../Commands/Moderation/ban";
import { Purge } from "../Commands/Moderation/Purge";
import { GetChannelInfo } from "../Commands/Roblox/GetChannelInfo";
import { GetRobloxAds } from "../Commands/Roblox/GetRobloxAds";
import { IsItFucked } from "../Commands/Util/IsItFucked";
import { ResolveAsset } from "../Commands/Util/ResolveAsset";
import { FlameText } from "../Commands/Fun/FlameText";
import { VideoToGif } from "../Commands/Fun/VideoToGif";
import { ListJobs } from "../Commands/Util/ListJobs";
import { Setup } from "../Commands/Server/Setup"
import { ThrowException } from "../Commands/Test/ThrowException";

export var Commands: Command[] = [ban, GetChannelInfo, GetRobloxAds, IsItFucked, ResolveAsset, SRSGet, Purge, FlameText, VideoToGif, ListJobs, Setup, ThrowException];