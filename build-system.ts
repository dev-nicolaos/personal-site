import { copySync } from "https://deno.land/std@0.132.0/fs/copy.ts";
import {
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "https://deno.land/std@0.132.0/fs/mod.ts";
import { SEP } from "https://deno.land/std@0.132.0/path/separator.ts";

const SOURCE_FOLDER_NAME = "src";
const BUILD_FOLDER_NAME = "dist";
const BLOCKS_FOLDER_NAME = "blocks";
const PAGES_FOLDER_NAME = "pages";
const STATIC_FOLDER_NAME = "www";
const BLOCKS_FOLDER_PATH = `./${SOURCE_FOLDER_NAME}/${BLOCKS_FOLDER_NAME}`;

type BlockFunc = (pageSlug: string) => string;
type BlocksDict = { [blockName: string]: BlockFunc | string };

async function getBlockFuncs(): Promise<BlocksDict> {
  const blocks: BlocksDict = {};

  for await (const { isFile, name } of Deno.readDir(BLOCKS_FOLDER_PATH)) {
    if (isFile && (name.endsWith(".js") || name.endsWith(".ts"))) {
      const { default: block }: { default: BlockFunc } = await import(
        // performance.now to bust cache in case block file has changed
        `${BLOCKS_FOLDER_PATH}/${name}?${performance.now()}`
      );

      const blockName = name.slice(0, -3);

      blocks[blockName] = block;
    }
  }

  return blocks;
}

const sourcePathRegex = `^${SOURCE_FOLDER_NAME}\\${SEP}(${PAGES_FOLDER_NAME}|${STATIC_FOLDER_NAME})`;
const getBuildPath = (sourcePath: string) =>
  sourcePath.replace(new RegExp(sourcePathRegex), BUILD_FOLDER_NAME);

const hydrateBlock = (blocks: BlocksDict, pageSlug: string) => (match: string) => {
  const invokedName = match.slice(2, -2).trim();
  const maybeBlock = blocks[invokedName];
  if (!maybeBlock) return match;
  return (typeof maybeBlock === "string" ? maybeBlock : maybeBlock(pageSlug)).trim();
};

const hydrateBlocksInFile = (file: string, blocks: BlocksDict, pageSlug: string) =>
  file.replaceAll(/{{ \S+ }}/g, hydrateBlock(blocks, pageSlug));

const getSlug = (path: string) => {
  if (!path.endsWith(`${SEP}index.html`)) {
    throw Error(`All pages must live at /slug/index.html, encountered ${path}`);
  }

  const slugEndIndex = path.length - 11; // /index.html
  const slugStartIndex = path.lastIndexOf(SEP, slugEndIndex - 1) + 1;

  const folderName = path.slice(slugStartIndex, slugEndIndex);

  return folderName === 'src' ? '/' : folderName;
}

export async function buildPages(pageSourcePaths: string[]) {
  const blocks = await getBlockFuncs();
  pageSourcePaths.forEach((path) => {
    const outFile = hydrateBlocksInFile(
      Deno.readTextFileSync(path),
      blocks,
      getSlug(path),
    );

    const buildPath = getBuildPath(path);
    ensureFileSync(buildPath);
    Deno.writeTextFileSync(buildPath, outFile);
  });
}

type FilterFunction = (path: string) => boolean;
const getAllSourceFilePaths = (filterFn?: FilterFunction) => {
  const paths = Array
    .from(walkSync(SOURCE_FOLDER_NAME, { includeDirs: false }))
    .map(({ path }) => path);

  return filterFn ? paths.filter(filterFn) : paths;
};

const getAllPagePaths = () =>
  getAllSourceFilePaths((path) => path.startsWith(`src${SEP}pages`));

export async function buildAllPages() {
  await buildPages(getAllPagePaths());
}

export function copyStaticFile(filePath: string) {
  const buildPath = getBuildPath(filePath);
  ensureFileSync(buildPath);
  copySync(filePath, buildPath, { overwrite: true });
}

export const filterStaticPaths = (path: string) =>
  path.startsWith(`src${SEP}www`);

function copyAllStaticFiles() {
  const staticFilePaths = getAllSourceFilePaths(filterStaticPaths);
  staticFilePaths.forEach(copyStaticFile);
}

export async function buildSite() {
  emptyDirSync(BUILD_FOLDER_NAME);
  await buildAllPages();
  copyAllStaticFiles();
}
