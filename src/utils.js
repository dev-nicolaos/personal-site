export const filterOutDrafts = (thought) => !thought.frontmatter.draft;

export const sortThoughtsByPublishDate = (thought1, thought2) =>
  Date.parse(thought2.frontmatter.publishDate) -
  Date.parse(thought1.frontmatter.publishDate);
