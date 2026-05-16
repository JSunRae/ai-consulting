import { execFileSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";


const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".netlify",
  "node_modules",
  "site-dist",
]);


async function collectSourceFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      files.push(
        ...(await collectSourceFiles(path.join(directoryPath, entry.name))),
      );
      continue;
    }

    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    files.push(path.join(directoryPath, entry.name));
  }

  return files;
}


function syntaxCheck(filePath) {
  execFileSync(process.execPath, ["--check", filePath], {
    stdio: "pipe",
  });
}


async function main() {
  const files = (await collectSourceFiles(ROOT)).sort();
  for (const filePath of files) {
    syntaxCheck(filePath);
  }

  console.log(`JavaScript syntax OK for ${files.length} files.`);
}


main().catch((error) => {
  if (error?.stdout) {
    process.stdout.write(error.stdout.toString());
  }
  if (error?.stderr) {
    process.stderr.write(error.stderr.toString());
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
