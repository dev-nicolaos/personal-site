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


await buildSite();

const devCommand = ["netlify", "dev"];

const netlifyServer = Deno.run({
  cmd: Deno.build.os === "windows" ? ["cmd", "/c"].concat(devCommand) : devCommand,
  stderr: "piped",
  stdout: "null",
  stdin: "null",
});

netlifyServer.stderrOutput().then(err => {
  console.error(new TextDecoder().decode(err));
  Deno.exit();
});

addEventListener('unload', () => {
  try {
    netlifyServer.kill("SIGINT");
  } catch {
    // swallow error if netlify server has already stopped
  }
});

const watcher = Deno.watchFs("./src");
console.log("Watching for changes...");
for await (const event of watcher) handleChange(event);
