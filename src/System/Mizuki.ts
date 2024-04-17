import Logger from "@system/Logger";
import { Client, type User } from "discord.js";
import { JobSystem } from "@system/JobSystem";
import Listeners from "src/Listeners/Listeners";
import { DatabaseSystem } from "./DatabaseSystem";
import { RoutineSystem } from "./RoutineSystem";

import * as Sentry from "@sentry/node"

export const Mizuki = {
  logger: new Logger("System/Mizuki"),
  client: new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
  }),
  secrets: {
    TOKEN: process.env.TOKEN as string,
    EXP_TOKEN: process.env.EXP_TOKEN as string,
    OWNER_ID: process.env.OWNER_ID as string,
    MONGO_URL: process.env.MONGO_URL as string,
    SENTRY_DSN: process.env.SENTRY_DSN as string,
    NODE_ENV: process.env.NODE_ENV as string,
  },
  ownerObject: undefined as User | undefined,
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
      await this.client.login(process.env.TOKEN);
    } catch (err) {
      Sentry.captureException(err)
      this.logger.error(`Failed to login ${err}`);
    } finally {
      this.logger.log(
        `Logged in as ${this.client.user?.username}#${this.client.user?.discriminator}`,
      );
    }

    try {
      const botOwner = (await this.client.users.fetch(
        process.env.OWNER_ID as string,
      )) as User;

      if (botOwner === undefined) {
        const error = new Error(
          "Discord returned no user object for the owner's id, is OWNER_ID present in the .env file?",
        );

        Sentry.captureException(error)
        throw error;
        // biome-ignore lint/style/noUselessElse: nuh uh
      } else {
        this.ownerObject = botOwner;
      }
    } catch (err) {
      this.logger.error(`Failed to fetch bot owner info: ${err}`);
      process.exit(1);
    } finally {
      this.logger.log(
        `Successfully retrieved owner info: ${this.ownerObject?.username} is this instance's owner.`,
      );
    }
  },
};
