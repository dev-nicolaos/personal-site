import { debounce } from "https://deno.land/std@0.132.0/async/mod.ts";

import {
  buildAllPages,
  buildPages,
  buildSite,
  copyStaticFile,
  filterStaticPaths,
  removeBuiltFile,
  SOURCE_FOLDER_NAME,
  BLOCKS_FOLDER_NAME,
  PAGES_FOLDER_NAME,
} from "./build-system.ts";

import { startServer, killServer } from "./devServer.ts";

const getDebouncedPageBuilder = (pageSourcePath: string) => debounce(async () => {
  await buildPages([pageSourcePath]);
}, 200);

const debouncedPageBuilders: {
  [pageSourcePath: string]: ReturnType<typeof getDebouncedPageBuilder>,
} = {};

function buildIndividualPage(pageSourcePath: string) {
  if (!debouncedPageBuilders[pageSourcePath]) {
    debouncedPageBuilders[pageSourcePath] = getDebouncedPageBuilder(pageSourcePath);
  }
  debouncedPageBuilders[pageSourcePath]();
}

function handlePagesChange(event: Deno.FsEvent) {
  if (event.paths.find(path => path.includes(BLOCKS_FOLDER_NAME))) {
    buildAllPages();
  } else {
    event.paths
      .filter((path) => path.includes(PAGES_FOLDER_NAME) && path.endsWith("index.html"))
      .forEach(event.kind === "remove" ? removeBuiltFile : buildIndividualPage);
  }
}

function handleStaticAssetsChange(event: Deno.FsEvent) {
  event.paths
    .filter(filterStaticPaths)
    .forEach(event.kind === "remove" ? removeBuiltFile : copyStaticFile);
}

const logChangeDetected = debounce(() => {
  console.log(
    new Date().toLocaleTimeString(),
    "Changes detected, attempting to rebuild...",
  );
}, 200);

function handleChange(event: Deno.FsEvent) {
  logChangeDetected();
  handlePagesChange(event);
  handleStaticAssetsChange(event);
}

try {
  console.log("Building site...");
  await buildSite();
  console.log("Site built successfully!");

  console.log("Starting dev server...");
  const server = startServer();

  // BEGIN HANDLING SHUTDOWN

  /**
   * We have two processes to manage:
   *  - This Deno process which watches for changes to the site source code and rebuilds
   *  - The server process we spawn w/Deno.run which serves completed build folder
   * We want to make sure that if one process terminates, the other does as well.
   * Place any code needed to ensure this behavior in this section
   */

  /**
   * Free Wins
   *  - Because the server iherits stdin, pressing ctrl+c in the terminal running this process should stop it as well.
   */

  // Kill server if this process ends programattically (e.g. Deno.exit)
  const handleUnload = () => {
    console.log("Unload event triggered for build watcher, stopping dev server...");
    killServer(server.pid);
  };
  addEventListener("unload", handleUnload);

  // If the server stops (either programmatically or errors out), stop this process
  server.status().then((serverExitStatus) => {
    if (!serverExitStatus.success) {
      console.error(`Dev server errored with code ${serverExitStatus.code}, stopping build watcher...`);
    }
    removeEventListener("unload", handleUnload);
    Deno.exit();
  });

  // END HANDLING SHUTDOWN

  const watcher = Deno.watchFs(SOURCE_FOLDER_NAME);
  console.log("Watching for changes...");
  for await (const event of watcher) handleChange(event);
} catch (err) {
  console.error("Uncaught error in build watcher:", err);
  Deno.exit(1);
}
