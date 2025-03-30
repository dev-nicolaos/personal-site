import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { sortEntriesByPubDate, slugify } from "../../utils";
import { getCollection, type CollectionEntry } from "astro:content";
// Using micromark since its part of the unifiedjs ecosystem Astro already uses and thus will be installed regardless.
import { micromark } from "micromark";

export function formatLinkLikeFeedItem({
	data,
	id,
	body,
}: CollectionEntry<"links-and-likes">) {
	if (!body) {
		throw Error(
			`Tried to format link like feed item "${id}", but object has no body`,
		);
	}

	return {
		content: micromark(body),
		link: `/links-and-likes/${slugify(id)}/`,
		pubDate: new Date(data.pubDate),
		title: id,
	};
}

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
