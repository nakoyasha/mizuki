import { RGBTuple } from "discord.js";

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
  }
}