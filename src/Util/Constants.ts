import { RGBTuple } from "discord.js";

export type FormattedServerFeature = {
  text: string,
  deprecated?: boolean,
}

export const constants = {
  colors: {
    discord_blurple: [88, 101, 242] as RGBTuple,
    roblox_white: [255, 255, 255] as RGBTuple,
    error: 16724787,
  },
  icons: {
    discord: "https://cdn.discordapp.com/emojis/1226525739327946752.webp?size=96",
    roblox: "https://cdn.discordapp.com/emojis/1226525984107270256.webp?size=96",
  },
  messages: {
    EVAL_CODE_RAN_NO_OUTPUT: "The code executed, but has no output",
    EVAL_CODE_USER_TRIED_TO_SEND_THE_BOT_TOKEN_BUT_WE_WONT_LET_THEM_DO_THAT_BECAUSE_OH_GOD_THAT_IS_BAD_VERY_VERY_VERY_BAD: "The code executed, but returned the bot's token! Uh-oh!"
  },
  formatted_server_features: new Map<string, FormattedServerFeature>(Object.entries({
    // Censored for your own good, hint: just lookup what "BFG" in BFG-9000 means
    BFG: {
      text: "Big ###### Guild"
    },
    VERIFIED: {
      text: "Verified"
    },
    AUTO_MODERATION: {
      text: "AutoMod",
    },
    BANNER: {
      text: "Banner",
    },
    INVITE_SPLASH: {
      text: "Invite Splash",
    },
    ROLE_ICONS: {
      text: "Role Icons",
    },
    ANIMATED_ICON: {
      text: "Animated Icon",
    },
    NEWS: {
      text: "Announcement Channels",
    },
    COMMUNITY: {
      text: "Community",
    },
    DISCOVERABLE: {
      text: "Discoverable",
    },
    PREVIEW_ENABLED: {
      text: "Preview Enabled"
    },
    ANIMATED_BANNER: {
      text: "Animated Banner"
    },
    GUILD_SERVER_GUIDE: {
      text: "Server Guide Enabled"
    },
    MEMBER_VERIFICATION_GATE_ENABLED: {
      text: "Verification Gate"
    },
    VANITY_URL: {
      text: "Vanity URL",
    },
    GUILD_WEB_PAGE_VANITY_URL: {
      text: "Web Page",
    },
    AUTOMOD_TRIGGER_USER_PROFILE: {
      text: "AutoMod on User Profiles",
    },
    DEVELOPER_SUPPORT_SERVER: {
      text: "Application Support Server",
    },
    RELAY_ENABLED: {
      text: "Relay",
      deprecated: false,
    },
    CREATOR_MONETIZABLE: {
      text: "Monetization Enabled"
    },
    INCREASED_THREAD_LIMIT: {
      text: "Increased Threads limit",
      deprecated: true,
    },
    GUILD_HOME_TEST: {
      text: "Server Home",
      deprecated: true,
    },
    THREADS_ONLY_CHANNEL: {
      text: "Forums",
      deprecated: true,
    },
    TEXT_IN_VOICE_ENABLED: {
      text: "Text in Voice Channels",
      deprecated: true,
    },
    GUILD_PRODUCTS: {
      text: "Server Products"
    },
    SUMMARIES_ENABLED_GA: {
      text: "Summaries"
    },
    SUMMARIES_ENABLED_BY_USER: {
      text: "Summaries Enabled"
    },
    // TODO: figure out what this is
    HAS_DIRECTORY_ENTRY: {
      text: "Directory Entry",
    },
    INVITES_DISABLED: {
      text: "Invites Disabled"
    },
    CREATOR_STORE_PAGE: {
      text: "Store Page"
    },
    ACTIVITY_FEED_ENABLED_BY_USER: {
      text: "Activity Feed"
    },
    PREMIUM_TIER_3_OVERRIDE: {
      text: "**Staff Override:** Server Boost Lvl. 3"
    },
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: {
      text: "Role Subscriptions",
    },
    LINKED_TO_HUB: {
      text: "Linked to School Hub"
    },
    WELCOME_SCREEN_ENABLED: {
      text: "Welcome Screen",
      deprecated: true,
    },
    SOUNDBOARD: {
      text: "Soundboard",
      deprecated: true
    },
    MEMBER_PROFILES: {
      text: "Member Profiles",
      deprecated: true
    },
    CHANNEL_ICON_EMOJIS_GENERATED: {
      text: "Channel Icons Emojis",
      deprecated: true,
    },
    THREADS_ENABLED: {
      text: "Threads",
      deprecated: true,
    },
    PRIVATE_THREADS: {
      text: "Threads: Private Threads",
      deprecated: true
    },
    THREE_DAY_THREAD_ARCHIVE: {
      text: "Threads: 3 day archive",
      deprecated: true
    },
    SEVEN_DAY_THREAD_ARCHIVE: {
      text: "Threads: 7 day archive",
      deprecated: true
    },
  }))
}