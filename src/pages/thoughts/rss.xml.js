import rss from "@astrojs/rss";
import { filterOutDrafts, sortThoughtsByPublishDate } from "../../utils";

const thoughts = Object.values(import.meta.glob("../**/*.md", { eager: true }))
  .filter(filterOutDrafts)
  .sort(sortThoughtsByPublishDate);

export const get = () =>
  rss({
    description:
      "A series of thoughts about life, technology and web development.",
    items: thoughts.map(({ frontmatter, url }) => ({
      description: frontmatter.description,
      link: url,
      pubDate: frontmatter.publishDate,
      title: frontmatter.title,
    })),
    site: `${import.meta.env.SITE}thoughts/`,
    stylesheet: "/assets/pretty-feed-v3.xsl",
    title: "Nicolaos Skimas",
  });
