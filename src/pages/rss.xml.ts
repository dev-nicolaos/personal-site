import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { sortEntriesByPubDate } from "../utils";
import { getCollection, type CollectionEntry } from "astro:content";
import { formatThoughtFeedItem } from "./thoughts/rss.xml";
import { formatLinkLikeFeedItem } from "./links-and-likes/rss.xml";

function formatFeedItem(
	feedItem: CollectionEntry<"links-and-likes"> | CollectionEntry<"thoughts">,
) {
	switch (feedItem.collection) {
		case "links-and-likes":
			return formatLinkLikeFeedItem(feedItem);
		case "thoughts":
			return formatThoughtFeedItem(feedItem);
	}
}

const items = (
	await Promise.all([
		getCollection("thoughts"),
		getCollection("links-and-likes"),
	])
)
	.flat()
	.sort(sortEntriesByPubDate)
	.map(formatFeedItem);

export const GET: APIRoute = (context) =>
	rss({
		description:
			"An aggregation of all the posts from the various feeds on nicolaos.dev",
		items,
		site: `${context.site}/links-and-likes/`,
		stylesheet: "/assets/pretty-feed-v3.xsl",
		title: "Nicolaos Skimas",
	});
