import Logger from "@system/Logger";
import { Client, User } from "discord.js";
import { JobSystem } from "@system/JobSystem";
import Listeners from "src/Listeners/Listeners";
import { DatabaseSystem } from "./Database/DatabaseSystem";

export const Mizuki = {
  logger: new Logger("Mizuki"),
  client: new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
  }),
  ownerObject: undefined as User | undefined,
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
  },
  async start() {
    this.logger.log("Mizuki Initlization Begin");
    this.logger.log("Attempting login..");
    try {
      await this.client.login(process.env.TOKEN);
    } catch (err) {
      this.logger.error(`Failed to login ${err}`);
    } finally {
      this.logger.log(
        `Logged in as ${this.client.user?.username}#${this.client.user?.discriminator}`,
      );
    }

    try {
      console.log(process.env.OWNER_ID as string);
      const botOwner = (await this.client.users.fetch(
        process.env.OWNER_ID as string,
      )) as User;

      if (botOwner == undefined) {
        throw new Error(
          "Discord returned no user object for the owner's id, is OWNER_ID present in the .env file?",
        );
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
