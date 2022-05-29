import { dirname, fromFileUrl, SEP } from "std/path/mod.ts";

export const BLOCKS_FOLDER_NAME = "blocks";
export const BUILD_FOLDER_NAME = "dist";
export const PAGES_FOLDER_NAME = "pages";
export const SOURCE_FOLDER_NAME = "src";
export const STATIC_FOLDER_NAME = "www";

const PROJECT_ROOT_PATH = fromFileUrl(dirname(dirname(import.meta.url)));

export const SOURCE_FOLDER_PATH = PROJECT_ROOT_PATH + SEP + SOURCE_FOLDER_NAME;

export const BLOCKS_FOLDER_PATH = SOURCE_FOLDER_NAME + SEP + BLOCKS_FOLDER_NAME;
export const BUILD_FOLDER_PATH = SOURCE_FOLDER_NAME + SEP + BUILD_FOLDER_NAME;
export const PAGES_FOLDER_PATH = SOURCE_FOLDER_NAME + SEP + PAGES_FOLDER_NAME;
export const STATIC_FOLDER_PATH = SOURCE_FOLDER_NAME + SEP + STATIC_FOLDER_NAME;
