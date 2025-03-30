import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { sortEntriesByPubDate, slugify } from "../../utils";
import { getCollection, type CollectionEntry } from "astro:content";
import { micromark } from "micromark";

export const formatLinkLikeFeedItem = ({
	data,
	id,
	body,
}: CollectionEntry<"links-and-likes">) => ({
	description: micromark(body),
	link: `/links-and-likes/${slugify(id)}/`,
	pubDate: new Date(data.pubDate),
	title: id,
});

const linkLikes = (await getCollection("links-and-likes")).sort(
	sortEntriesByPubDate,
);

export const GET: APIRoute = (context) =>
	rss({
		description:
			"A series of shout outs celebrating other people's ideas and projects.",
		items: linkLikes.map(formatLinkLikeFeedItem),
		site: `${context.site}/links-and-likes/`,
		stylesheet: "/assets/pretty-feed-v3.xsl",
		title: "Nicolaos Skimas (Links and Likes)",
	});
