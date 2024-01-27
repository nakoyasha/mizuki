import { APIMemberData } from "./APIMemberData"

export type APIGuildData = {
  type: 0,
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