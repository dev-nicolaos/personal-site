import { debounce } from "https://deno.land/std@0.120.0/async/mod.ts";

import {
  buildAllHTMLFiles,
  buildHTMLFiles,
  buildSite,
  copyStaticFile,
  filterStaticPaths,
} from "./build-system.ts";

const handleChange = debounce(async (event: Deno.FsEvent) => {
  console.log(
    new Date().toLocaleTimeString(),
    "Change detected, attempting to build...",
  );

  const changedBlockFiles = event.paths.filter(path => path.includes("blocks"));

  if (changedBlockFiles.length > 0) {
    buildAllHTMLFiles();
  } else {
    const changedHTMLFiles = event.paths.filter(path => path.endsWith(".html"));
    if (changedHTMLFiles.length > 0) {
      await buildHTMLFiles(changedHTMLFiles);
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
const devCommand = ["netlify", "dev"].concat(Deno.args);
const netlifyServer = Deno.run({
  cmd: Deno.build.os === "windows" ? ["cmd", "/c"].concat(devCommand) : devCommand,
  stderr: "piped",
});

netlifyServer.stderrOutput().then(err => {
  const decodedError = new TextDecoder().decode(err);
  console.error("Dev server errored with error:", decodedError);
  Deno.exit();
});

const watcher = Deno.watchFs("./src");
console.log("Watching for changes...");
for await (const event of watcher) handleChange(event);
