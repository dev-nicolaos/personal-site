import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import * as pagefind from "pagefind";
import sitemap from "@astrojs/sitemap";
import rehypeClassNames from "rehype-class-names";
import rehypeRaw from "rehype-raw";

const pageFind: AstroIntegration = {
	name: "pagefind",
	hooks: {
		"astro:build:done": async ({ dir }) => {
			const outputDirPath = fileURLToPath(dir);

			const { index, errors: createIndexErrors } =
				await pagefind.createIndex();

			if (!index) {
				createIndexErrors.forEach(console.error);
				throw new Error(
					"Pagefind error occured while creating index, see above for detials",
				);
			}

			const { errors: addDirectoryErrors } = await index.addDirectory({
				path: outputDirPath,
			});

			if (addDirectoryErrors.length > 0) {
				addDirectoryErrors.forEach(console.error);
				throw new Error(
					`Pagefind error occured while adding directory ${outputDirPath}, see above for detials`,
				);
			}

			const outputPath = join(outputDirPath, "pagefind");
			const { errors: writeFilesErrors } = await index.writeFiles({
				outputPath,
			});

			if (writeFilesErrors.length > 0) {
				writeFilesErrors.forEach(console.error);
				throw new Error(
					`Pagefind error occured while writing files to ${outputPath}, see above for detials`,
				);
			}
		},
	},
};

export default defineConfig({
	integrations: [sitemap(), pageFind],
	site: "https://nicolaos.dev",
	markdown: {
		remarkRehype: {
			allowDangerousHtml: true,
		},
		rehypePlugins: [
			rehypeRaw,
			[
				rehypeClassNames,
				{
					"a[href]": "link",
					blockquote: "blockquote flow",
					details: "details",
					em: "italic",
					h2: "secondary-heading",
					h3: "tertiary-heading",
					hr: "break",
					":not(pre) code": "inline-code",
					"ol,ul": "list",
					p: "paragraph",
					strong: "bold",
				},
			],
		],
	},
});
