import esbuild from "esbuild";
import { execSync } from "child_process";
import { join } from "path";
import { readdirSync } from "fs";

// ty veee!!!
function readDirRecursive(dir) {
  const children = readdirSync(dir, { withFileTypes: true });

  return children.flatMap((c) => {
    const fullName = join(dir, c.name);
    if (c.isDirectory()) return readDirRecursive(fullName);
    return fullName;
  });
}

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

/**
 * @type {(namespace: string) => esbuild.Plugin}
 */
const includeDirPlugin = (namespace) => ({
  name: `include-dir-plugin:${namespace}`,
  setup(build) {
    const filter = new RegExp(`^~${namespace}$`);
    const dir = `./src/${namespace}`;

    build.onResolve({ filter }, (args) => ({ path: args.path, namespace }));

    build.onLoad({ filter, namespace }, async () => {
      const files = await readDirRecursive(dir);
      return {
        contents: files
          .map((f) => `import "./${f.replace(".ts", "")}"`)
          .join("\n"),
        resolveDir: dir,
      };
    });
  },
});

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
  plugins: [
    includeDirPlugin("Commands"),
    makeAllPackagesExternalPlugin,
    gitHashPlugin,
  ],
  outfile: "dist/index.js",
  treeShaking: true,
  platform: "node",
  logLevel: "info",
});
