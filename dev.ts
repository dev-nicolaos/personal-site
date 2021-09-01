import { debounce } from "https://deno.land/std@0.106.0/async/mod.ts";

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


await buildSite();

if (Deno.build.os !== "windows") {
  // Deno.run is currently unable to find scripts (as opposed to executables)
  // in the PATH on Windows, which is how npm packages like netlify ship
  const p = Deno.run({ cmd: ["netlify", "dev"] });
  await p.status();
}

const watcher = Deno.watchFs("./src");
console.log("Watching for changes...");
for await (const event of watcher) handleChange(event);
