import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeClassNames from "rehype-class-names";
import rehypeRaw from "rehype-raw";

export default defineConfig({
	integrations: [sitemap()],
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
					kbd: "keys",
					":not(pre) code": "inline-code",
					"ol,ul": "list",
					p: "paragraph",
					strong: "bold",
				},
			],
		],
	},
});
