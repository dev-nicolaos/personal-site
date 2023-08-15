import rss from "@astrojs/rss";
import { getTaggedThoughtsStaticPaths, prettifyTag } from "../../../../utils";

export const getStaticPaths = getTaggedThoughtsStaticPaths;

export function get(context) {
  const { tag } = context.params;
  return rss({
    description: `Nicolaos' posts about ${prettifyTag(tag, {
      capitalize: false,
    })}`,
    items: context.props.thoughts.map(({ data, slug }) => ({
      description: data.description,
      link: `/thoughts/${slug}/`,
      pubDate: data.pubDate,
      title: data.title,
    })),
    site: `${context.site}/thoughts/tag/${tag}`,
    stylesheet: "/assets/pretty-feed-v3.xsl",
    title: `${prettifyTag(tag)} - Nicolaos Skimas`,
  });
}
