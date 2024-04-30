import Logger from "@system/Logger";
import { Client, CommandInteractionOptionResolver, type User } from "discord.js";
import { JobSystem } from "@system/JobSystem";
import Listeners from "src/Listeners/Listeners";
import { DatabaseSystem } from "./DatabaseSystem";
import { RoutineSystem } from "./RoutineSystem";

import { instance } from "../../config.json"
import * as Sentry from "@sentry/node"

export type InstanceInfo = {
  name: string;
  username: string;
  id: string;
  repoUrl: string;
}

export const Mizuki = {
  logger: new Logger("System/Mizuki"),
  client: new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
  }),
  secrets: {
    TOKEN: process.env.STAGING_TOKEN as string,
    EXP_TOKEN: process.env.EXP_TOKEN as string,
    MONGO_URL: process.env.MONGO_URL as string,
    SENTRY_DSN: process.env.SENTRY_DSN as string,
    NODE_ENV: process.env.NODE_ENV as string,
  },
  instanceInfo: {
    name: "Mizuki",
    username: "nakoyasha",
    id: "222069018507345921",
    repoUrl: "https://github.com/nakoyasha/mizuki",
  } as InstanceInfo,
  routinesDisabled: false,
  async init() {
    this.logger.log("initializing listeners");
    this.client.on("ready", Listeners.Ready);
    this.client.on("interactionCreate", Listeners.InteractionCreate);
    this.client.on("messageCreate", Listeners.MessageCreate);
    this.client.on("guildCreate", Listeners.GuildCreate);

    this.logger.log("Starting JobSystem");
    JobSystem.start();

    this.logger.log("Starting DatabaseSystem");
    await DatabaseSystem.startMongoose();
    this.logger.log("Starting RoutineSystem");
    RoutineSystem.start()
  },
  async start() {
    this.logger.log("Initializing sentry");
    if (this.secrets.NODE_ENV !== "development") {
      Sentry.init({
        dsn: this.secrets.SENTRY_DSN,
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
      })
    }


    this.logger.log("Mizuki Initlization Begin");
    this.logger.log("Attempting login..");
    try {
      await this.client.login(this.secrets.TOKEN);
    } catch (err) {
      Sentry.captureException(err)
      this.logger.error(`Failed to login ${err}`);
      return;
    } finally {
      this.logger.log(
        `Logged in as ${this.client.user?.username}#${this.client.user?.discriminator}`,
      );
    }

    try {
      const botOwner = (await this.client.users.fetch(
        instance.ownerId,
      )) as User;

      if (botOwner === undefined) {
        const error = new Error(
          "Discord returned no user object for the owner's id, is OWNER_ID present in the .env file?",
        );

        Sentry.captureException(error)
        throw error;
        // biome-ignore lint/style/noUselessElse: nuh uh
      } else {
        this.instanceInfo.name = this.instanceInfo.name;
        this.instanceInfo.username = botOwner.username;
        this.instanceInfo.id = botOwner.id;
        this.instanceInfo.repoUrl = this.instanceInfo.repoUrl;
      }
    } catch (err) {
      this.logger.error(`Failed to fetch bot owner info: ${err}`);
      process.exit(1);
    } finally {
      this.logger.log(
        `Successfully retrieved owner info: ${this.instanceInfo?.username} is this instance's owner.`,
      );
    }
  },
};
