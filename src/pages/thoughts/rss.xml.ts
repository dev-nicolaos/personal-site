import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { filterOutDraftThoughts, sortEntriesByPubDate } from "../../utils";
import { getCollection, type CollectionEntry } from "astro:content";

const thoughts = (await getCollection("thoughts", filterOutDraftThoughts)).sort(
	sortEntriesByPubDate,
);

export const formatThoughtFeedItem = ({
	data,
	id,
}: CollectionEntry<"thoughts">) => ({
	description: data.description,
	link: `/thoughts/${id}/`,
	pubDate: new Date(data.pubDate),
	title: data.title,
});

export const GET: APIRoute = (context) =>
	rss({
		description:
			"A series of posts about life, technology and web development.",
		items: thoughts.map(formatThoughtFeedItem),
		site: `${context.site}/thoughts/`,
		stylesheet: "/assets/pretty-feed-v3.xsl",
		title: "Nicolaos Skimas (Thoughts)",
	});
