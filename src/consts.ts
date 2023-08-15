const RSSBase = `${import.meta.env.SITE}/thoughts`;

export const RSS_URLS = Object.freeze({
  all: `${RSSBase}/rss.xml`,
  life: `${RSSBase}/tag/life/rss.xml`,
  technology: `${RSSBase}/tag/technology/rss.xml`,
  webDevelopment: `${RSSBase}/tag/web-development/rss.xml`,
});
