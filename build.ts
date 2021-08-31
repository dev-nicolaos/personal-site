import {
  copySync,
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "https://deno.land/std@0.106.0/fs/mod.ts";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "dist";
const BLOCK_SYNTAX_REGEX = /{{ \S+ }}/g;

const renderedBlocks: { [index: string]: string } = {};

const getBlockName = (invocation: string) => invocation.slice(2, -2).trim();

async function hydrateBlocks(file: string): Promise<string> {
  for (const match of file.matchAll(BLOCK_SYNTAX_REGEX)) {
    const blockName = getBlockName(match[0]);

    if (!renderedBlocks[blockName]) {
      const blockFolder = `./${SOURCE_FOLDER}/blocks/${blockName}`;

      const { default: render } = await import(`${blockFolder}/block.js`);
      const blockData = JSON.parse(
        Deno.readTextFileSync(`${blockFolder}/data.json`),
      );
      renderedBlocks[blockName] = render(blockData).trim();
    }
  }

  return file.replaceAll(
    BLOCK_SYNTAX_REGEX,
    (match) => renderedBlocks[getBlockName(match)],
  );
}

emptyDirSync(BUILD_FOLDER);

Array
  .from(walkSync(SOURCE_FOLDER))
  .filter(entry => entry.isFile && !entry.path.includes("blocks"))
  .forEach(async ({ path, name }) => {
    const outPath = path.replace(SOURCE_FOLDER, BUILD_FOLDER);
    ensureFileSync(outPath);

    if (name.endsWith(".html")) {
      const outFile = await hydrateBlocks(Deno.readTextFileSync(path));
      Deno.writeTextFileSync(outPath, outFile);
    } else {
      copySync(path, outPath, { overwrite: true });
    }
  });
