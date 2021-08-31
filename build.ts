import { relative, resolve } from "https://deno.land/std@0.106.0/path/mod.ts";
import { emptyDirSync, ensureFileSync, walkSync } from "https://deno.land/std@0.106.0/fs/mod.ts";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "dist";
const BLOCK_SYNTAX_REGEX = /{{ \S+ }}/g;

const renderedBlocks: any = {};

const getBlockName = (invocation: string) => invocation.slice(2, -2).trim();

async function hydrateBlocks(file: string): Promise<string> {
  for (const match of file.matchAll(BLOCK_SYNTAX_REGEX)) {
    const blockName = getBlockName(match[0]);

    if (!renderedBlocks[blockName]) {
      const blockFolder = `./${SOURCE_FOLDER}/blocks/${blockName}`;

      const { default: render } = await import(`${blockFolder}/block.js`);
      const blockData = JSON.parse(Deno.readTextFileSync(`${blockFolder}/data.json`));
      renderedBlocks[blockName] = render(blockData).trim();
    }
  }

  return file.replaceAll(BLOCK_SYNTAX_REGEX, (match) => renderedBlocks[getBlockName(match)]);
}

emptyDirSync(BUILD_FOLDER);

for (const entry of walkSync(SOURCE_FOLDER)) {
  if (entry.isFile) {
    const resolvedPath = relative(".", resolve(entry.path));

    const rawFile = Deno.readTextFileSync(resolvedPath);
    const outFile = entry.name.endsWith('.html') ? await hydrateBlocks(rawFile) : rawFile;

    const outPath = resolvedPath.replace(SOURCE_FOLDER, BUILD_FOLDER)

    ensureFileSync(outPath);
    Deno.writeTextFileSync(outPath, outFile);
  }
}
