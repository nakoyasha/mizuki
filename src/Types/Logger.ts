export type Logger = {
  name: string;
  logs: string[];

  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  dumpLogsToDisk(): void;
};
