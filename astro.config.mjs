import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeClassNames from "rehype-class-names";

export default defineConfig({
	integrations: [sitemap()],
	site: "https://nicolaos.dev",
	markdown: {
		rehypePlugins: [
			[rehypeClassNames, { h2: "secondary-heading", "a[href]": "link" }],
		],
	},
});
