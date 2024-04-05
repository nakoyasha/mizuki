import { writeFileSync } from "fs";
import { Directories } from "../Maps/DirectoriesMap";
import { captureException } from "@sentry/node";

export default class Logger {
  name: string = "mizuki";
  constructor(name: string) {
    this.name = name;
  }
  logs: string[] = [];

  log(message: string) {
    const msg = `[+] [INFO] [${this.name}]: ${message}`;
    this.logs.push(msg);
    console.log(msg);
  }
  warn(message: string) {
    const msg = `[!] [WARN] [${this.name}]: ${message}`;
    this.logs.push(msg);
    console.warn(msg);
  }
  error(message: string) {
    const msg = `[-] [ERR] [${this.name}]: ${message}`;
    this.logs.push(msg);
    console.error(msg);
  }

  dumpLogsToDisk() {
    this.log("Beginning Disk Dump...");
    try {
      writeFileSync(
        Directories.Logs + this.name + " " + Date.now().toString() + ".log",
        this.logs.join("\n"),
      );
    } catch (err) {
      captureException(err)
      this.error(
        `Failed writing logs to disk: ${err} \nIt's really over this time.`,
      );
    }
  }
}
