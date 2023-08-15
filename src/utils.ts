import type { GetStaticPaths } from "astro";
import { CollectionEntry, getCollection } from "astro:content";

export type Thought = CollectionEntry<"thoughts">;
type Tag = Thought["data"]["tags"][number];

export const filterOutDrafts = (thought: Thought) => !thought.data.draft;

export const sortThoughtsByPubDate = (thought1: Thought, thought2: Thought) =>
  Date.parse(thought2.data.pubDate) - Date.parse(thought1.data.pubDate);

async function getThoughtsByTag() {
  const thoughts = await getCollection("thoughts", filterOutDrafts);

  const thoughtsByTag = thoughts.reduce((map, thought) => {
    thought.data.tags.forEach((tag) => {
      if (!map.has(tag)) {
        map.set(tag, new Set());
      }
      map.get(tag)!.add(thought);
    });
    return map;
  }, new Map<Tag, Set<Thought>>());

  return thoughtsByTag;
}

export const getTaggedThoughtsStaticPaths = async function () {
  const thoughtsByTag = await getThoughtsByTag();
  const tags = Array.from(thoughtsByTag.keys());
  return tags.map((tag) => ({
    params: { tag },
    props: {
      thoughts: Array.from(thoughtsByTag.get(tag)!).sort(sortThoughtsByPubDate),
    },
  }));
} satisfies GetStaticPaths;

export function prettifyTag(tag: Tag, { capitalize = true } = {}) {
  const words = tag.split("-");

  return (
    capitalize
      ? words.map((word) => word[0].toUpperCase() + word.slice(1))
      : words
  ).join(" ");
}
