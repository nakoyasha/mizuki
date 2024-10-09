// src/modules.d.ts
declare module "~git-hash" {
  const hash: string;
  export default hash;
}

declare module "~build-time" {
  const buildDate: Date;
  export default buildDate;
}
