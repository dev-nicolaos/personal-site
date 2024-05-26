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

export function stripMdFileExtension(filename: string): string {
	if (filename.endsWith(".md")) {
		return filename.slice(0, -3);
	}

	console.warn(filename, "does not have a .md file extension");
	return filename;
}
