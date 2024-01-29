export type MizukiRoutine = {
  name: string,
  // Run every (x) miliseconds
  run_every: number,
  execute: () => {},
}