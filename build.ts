import { buildSite } from "./build-system.ts";

try {
  await buildSite();
  console.log("Build completed successfully!");
} catch (err) {
  console.error("Build failed with the following error:");
  console.error(err);
}
