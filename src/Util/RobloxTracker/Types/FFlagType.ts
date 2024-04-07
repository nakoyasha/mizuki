// descriptions are taken from maximumadhd's Roblox-FFlag-Tracker repo !! (ty max)

export enum FFlagType {
  // A regular fast-variable that is initialized once
  // and does not change until a new session begins.

  Flag = "F",
  // A fast-variable that can change at run-time, and automatically updates every 5 minutes.
  DynamicFlag = "DF",
  // A fast-variable that is loaded by the server and sent to the client.  
  SynchronizedFast = "SF",
}