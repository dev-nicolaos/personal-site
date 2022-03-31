import { debounce } from "https://deno.land/std@0.125.0/async/mod.ts";

import {
  buildAllPages,
  buildPages,
  buildSite,
  copyStaticFile,
  filterStaticPaths,
} from "./build-system.ts";

import { startServer, killServer } from "./devServer.ts";

const handleChange = debounce(async (event: Deno.FsEvent) => {
  console.log(
    new Date().toLocaleTimeString(),
    "Change detected, attempting to build...",
  );

  const changedBlockFiles = event.paths.filter(path => path.includes("blocks"));

  if (changedBlockFiles.length > 0) {
    buildAllPages();
  } else {
    const changedHTMLFiles = event.paths.filter(path => path.endsWith(".html"));
    if (changedHTMLFiles.length > 0) {
      await buildPages(changedHTMLFiles);
    }
  }

  event.paths.filter(filterStaticPaths).forEach(path => {
    copyStaticFile(path)
  });
}, 200);

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

const watcher = Deno.watchFs("./src");
console.log("Watching for changes...");
for await (const event of watcher) handleChange(event);
