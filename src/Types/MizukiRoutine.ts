export interface MizukiRoutine {
  name: string,
  // Run every (x) miliseconds
  run_every: number,
  execute: () => {},
}