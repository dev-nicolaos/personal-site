import { copySync } from "std/fs/copy.ts";
import {
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "std/fs/mod.ts";
import { SEP } from "std/path/mod.ts";

import {
  BLOCKS_FOLDER_NAME,
  BLOCKS_FOLDER_PATH,
  BUILD_FOLDER_NAME,
  BUILD_FOLDER_PATH,
  PAGES_FOLDER_NAME,
  SOURCE_FOLDER_NAME,
  SOURCE_FOLDER_PATH,
  STATIC_FOLDER_NAME,
} from './consts.ts';

type BlockFunc = (pageSlug: string) => string;
type BlocksDict = { [blockName: string]: BlockFunc | string };

async function getBlockFuncs(): Promise<BlocksDict> {
  const blocks: BlocksDict = {};

  for await (const { isFile, name } of Deno.readDir(BLOCKS_FOLDER_PATH)) {
    if (isFile && (name.endsWith(".js") || name.endsWith(".ts"))) {
      const { default: block }: { default: BlockFunc } = await import(
        // performance.now to bust cache in case block file has changed
        `../${SOURCE_FOLDER_NAME}/${BLOCKS_FOLDER_NAME}/${name}?${performance.now()}`
      );

      const blockName = name.slice(0, -3);

      blocks[blockName] = block;
    }
  }

  return blocks;
}

const sourcePathRegex =
  `${SOURCE_FOLDER_NAME}\\${SEP}(${PAGES_FOLDER_NAME}|${STATIC_FOLDER_NAME})`;
const getBuildPath = (sourcePath: string) =>
  sourcePath.replace(new RegExp(sourcePathRegex), BUILD_FOLDER_NAME);

const getHydrateBlock = (blocks: BlocksDict, pageSlug: string) =>
  (match: string) => {
    const invokedName = match.slice(2, -2).trim();
    const maybeBlock = blocks[invokedName];
    if (!maybeBlock) return match;
    return (typeof maybeBlock === "string" ? maybeBlock : maybeBlock(pageSlug))
      .trim();
  };

const hydrateBlocksInFile = (
  file: string,
  blocks: BlocksDict,
  pageSlug: string,
) => file.replaceAll(/{{ \S+ }}/g, getHydrateBlock(blocks, pageSlug));

const getSlug = (path: string) => {
  if (!path.endsWith(`${SEP}index.html`)) {
    throw Error(
      `All pages must live at /{slug}/index.html, encountered ${path}`,
    );
  }

  const slugEndIndex = path.length - 11; // /index.html
  const slugStartIndex = path.lastIndexOf(SEP, slugEndIndex - 1) + 1;

  const folderName = path.slice(slugStartIndex, slugEndIndex);

  return folderName === PAGES_FOLDER_NAME ? "/" : folderName;
};

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

export const filterStaticSourceFilePaths = (path: string) => {
  try {
    return path.includes(SOURCE_FOLDER_NAME + SEP + STATIC_FOLDER_NAME) &&
      Deno.lstatSync(path).isFile;
  } catch {
    return false;
  }
};

export const filterPageSourceFilePaths = (path: string) =>
  path.includes(SOURCE_FOLDER_NAME + SEP + PAGES_FOLDER_NAME) &&
  path.endsWith("index.html");

export const filterBlockSourceFilePaths = (path: string) =>
  path.includes(SOURCE_FOLDER_NAME + SEP + BLOCKS_FOLDER_NAME) &&
  (path.endsWith(".js") || path.endsWith(".ts"));

type FilterFunction = (path: string) => boolean;
const getAllSourceFilePaths = (filterFn?: FilterFunction) => {
  const paths = Array
    .from(walkSync(SOURCE_FOLDER_PATH, { includeDirs: false }))
    .map(({ path }) => path);

  return filterFn ? paths.filter(filterFn) : paths;
};

export async function buildAllPages() {
  await buildPages(getAllSourceFilePaths(filterPageSourceFilePaths));
}

export function copyStaticFile(filePath: string) {
  const buildPath = getBuildPath(filePath);
  ensureFileSync(buildPath);
  copySync(filePath, buildPath, { overwrite: true });
}

function copyAllStaticFiles() {
  const staticFilePaths = getAllSourceFilePaths(filterStaticSourceFilePaths);
  staticFilePaths.forEach(copyStaticFile);
}

export function removeFromBuild(path: string) {
  try {
    const buildPath = getBuildPath(path);
    Deno.removeSync(buildPath, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}

export async function buildSite() {
  emptyDirSync(BUILD_FOLDER_PATH);
  await buildAllPages();
  copyAllStaticFiles();
}