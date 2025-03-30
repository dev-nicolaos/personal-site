import type { CollectionEntry } from "astro:content";

type EntryWithPubDate =
	| CollectionEntry<"links-and-likes">
	| CollectionEntry<"thoughts">;

export const sortEntriesByPubDate = (
	entry1: EntryWithPubDate,
	entry2: EntryWithPubDate,
) => Date.parse(entry2.data.pubDate) - Date.parse(entry1.data.pubDate);

export const filterOutDraftThoughts = (thought: CollectionEntry<"thoughts">) =>
	!thought.data.draft;

export function slugify(slugToBe: string): string {
	const slugParts = slugToBe
		.trim()
		.replaceAll(/[^\w\s]/g, "")
		.toLowerCase()
		.match(/\w+/g);

	if (slugParts === null) {
		throw Error(
			`Cannot slugify ${slugToBe}, contains no alphanumeric characters.`,
		);
	}

	return slugParts.join("-");
}

export function stripFileExtension(filename: string): string {
	if (!filename.includes(".")) {
		console.warn(
			"Tried to strip non-existent file extension from:",
			filename,
		);
		return filename;
	}

	return filename.slice(0, filename.lastIndexOf("."));
}
