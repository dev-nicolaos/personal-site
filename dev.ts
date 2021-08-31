import { debounce } from "https://deno.land/std@0.106.0/async/mod.ts";

const build = debounce(async (event?) => {
  if (event) {
    console.log(
      new Date().toLocaleTimeString(),
      "Change detected, attempting to build...",
    );
  }

  const process = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "build.ts"],
  });

  await process.status();
}, 200);

build();

if (Deno.build.os !== "windows") {
  // Deno.run is currently unable to find scripts (as opposed to executables)
  // in the PATH on Windows, which is how npm packages like netlify ship
  const p = Deno.run({ cmd: ["netlify", "dev"] });
  await p.status();
}

const watcher = Deno.watchFs("./src");
console.log("Watching for changes...");
for await (const event of watcher) build(event);

