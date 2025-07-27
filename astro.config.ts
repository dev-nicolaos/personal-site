import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeClassNames from "rehype-class-names";
import rehypeRaw from "rehype-raw";

export default defineConfig({
	integrations: [sitemap()],
	site: "https://nicolaos.dev",
	markdown: {
		shikiConfig: {
			themes: {
				dark: "poimandres",
				light: "solarized-light",
			},
			// Use light-dark here when better supported https://shiki.style/guide/dual-themes#light-dark-function
			defaultColor: "dark",
		},
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
					"pre:has(> code)": "code-block",
					":not(pre) code": "inline-code",
					"ol,ul": "list",
					p: "paragraph",
					strong: "bold",
				},
			],
		],
	},
	devToolbar: { enabled: false },
});
