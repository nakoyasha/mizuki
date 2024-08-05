import { APIMemberData } from "./APIMemberData"

export enum INVITE_TYPE {
  SERVER = 0,
  GDM = 1,
  FRIEND = 2,
}

export type APIGuildData = {
  type: INVITE_TYPE,
  code: string,
  expires_at?: string,
  inviter?: APIMemberData
  flags: number,
  guild: {
    id: string,
    name: string,
    splash?: string,
    banner?: string,
    description?: string,
    icon?: string,
    features: string[],
    verification_level: 1 | 2 | 3,
    vanity_url_code?: string,
    nsfw_level?: number,
    nsfw: boolean,
    premium_subscription_count: number,
  }
  guild_id: string,
  channel: {
    id: string,
    type: number,
    name: string,
  }
}