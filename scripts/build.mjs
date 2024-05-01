import esbuild from "esbuild";
import { execSync } from "child_process";

/**
 * @type {esbuild.Plugin}
 */
const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    const filter = /^[^./@~]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const gitHash = execSync("git rev-parse --short HEAD", {
  encoding: "utf-8",
}).trim();

/**
 * @type {import("esbuild").Plugin}
 */
const gitHashPlugin = {
  name: "git-hash-plugin",
  setup: (build) => {
    const filter = /^~git-hash$/;
    build.onResolve({ filter }, (args) => ({
      namespace: "git-hash",
      path: args.path,
    }));
    build.onLoad({ filter, namespace: "git-hash" }, () => ({
      contents: `export default "${gitHash}"`,
    }));
  },
};

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  plugins: [makeAllPackagesExternalPlugin, gitHashPlugin],
  outfile: "dist/index.js",
  treeShaking: true,
  platform: "node",
  logLevel: "info",
});
