import rss from "@astrojs/rss";
import { filterOutDrafts, sortThoughtsByPubDate } from "../../utils";
import { getCollection } from "astro:content";

const thoughts = (await getCollection("thoughts", filterOutDrafts)).sort(
	sortThoughtsByPubDate,
);

export const get = (context) =>
	rss({
		description:
			"A series of posts about life, technology and web development.",
		items: thoughts.map(({ data, slug }) => ({
			description: data.description,
			link: `/thoughts/${slug}/`,
			pubDate: data.pubDate,
			title: data.title,
		})),
		site: `${context.site}/thoughts/`,
		stylesheet: "/assets/pretty-feed-v3.xsl",
		title: "Nicolaos Skimas",
	});
