export const filterOutDrafts = (thought) => !thought.data.draft;

export const sortThoughtsByPubDate = (thought1, thought2) =>
	Date.parse(thought2.data.pubDate) - Date.parse(thought1.data.pubDate);
