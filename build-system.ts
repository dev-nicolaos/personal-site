import { copySync } from "https://deno.land/std@0.120.0/fs/copy.ts";
import {
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "https://deno.land/std@0.120.0/fs/mod.ts";

const SOURCE_FOLDER_NAME = "src";
const BUILD_FOLDER_NAME = "dist";
const BLOCKS_FOLDER_NAME = "blocks";
const BLOCKS_FOLDER_PATH = `./${SOURCE_FOLDER_NAME}/${BLOCKS_FOLDER_NAME}`;

type BlocksDict = { [blockName: string]: string };

async function generateBlocks(): Promise<BlocksDict> {
  const renderedBlocks: { [index: string]: string } = {};

  for await (const { isFile, name } of Deno.readDir(BLOCKS_FOLDER_PATH)) {
    if (isFile && (name.endsWith(".js") || name.endsWith(".ts"))) {
      const { default: block }: { default: string } = await import(
        // performance.now to bust cache in case block file has changed
        `${BLOCKS_FOLDER_PATH}/${name}?${performance.now()}`
      );

      const blockName = name.slice(0, -3);

      renderedBlocks[blockName] = block.trim();
    }
  }

  return renderedBlocks;
}

const getBuildPath = (sourcePath: string) =>
  sourcePath.replace(SOURCE_FOLDER_NAME, BUILD_FOLDER_NAME);

const hydrateBlocksInFile = (file: string, blocks: BlocksDict) =>
  file.replaceAll(/{{ \S+ }}/g, (match) => blocks[match.slice(2, -2).trim()]);

export async function buildHTMLFiles(htmlPaths: string[]) {
  const blocks = await generateBlocks();
  htmlPaths.forEach((path) => {
    const outFile = hydrateBlocksInFile(
      Deno.readTextFileSync(path),
      blocks,
    );

    const buildPath = getBuildPath(path);
    ensureFileSync(buildPath);
    Deno.writeTextFileSync(buildPath, outFile);
  });
}

type FilterFunction = (path: string) => boolean;
const getAllSourceFilePaths = (filterFn?: FilterFunction): string[] => {
  const paths = Array
    .from(walkSync(SOURCE_FOLDER_NAME, { includeDirs: false }))
    .map(({ path }) => path);

  return filterFn ? paths.filter(filterFn) : paths;
};

const getAllHTMLFilePaths = () =>
  getAllSourceFilePaths((path) => path.endsWith(".html"));

export async function buildAllHTMLFiles() {
  await buildHTMLFiles(getAllHTMLFilePaths());
}

export function copyStaticFile(filePath: string) {
  const buildPath = getBuildPath(filePath);
  ensureFileSync(buildPath);
  copySync(filePath, buildPath, { overwrite: true });
}

export const filterStaticPaths = (path: string) =>
  !path.endsWith(".html") && !path.includes(BLOCKS_FOLDER_NAME);

function copyAllStaticFiles() {
  const staticFilePaths = getAllSourceFilePaths(filterStaticPaths);
  staticFilePaths.forEach(copyStaticFile);
}

export async function buildSite() {
  emptyDirSync(BUILD_FOLDER_NAME);
  await buildAllHTMLFiles();
  copyAllStaticFiles();
}
