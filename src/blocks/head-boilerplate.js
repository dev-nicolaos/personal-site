import pagesMetaData from "./data/pages-meta-data.json" assert { type: "json" };

export default (pageSlug) => {
  const {
    description,
    heading,
    title = heading,
    titleTrailer = "Nicolaos Skimas",
  } = pagesMetaData[pageSlug];

  return /*html*/ `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${title} | ${titleTrailer}</title>
    <meta name="author" content="Nicolaos Skimas" />
    ${description ? /*html*/`<meta name="description" content="${description}" />` : "" }

    <meta name="theme-color" content="#5da562">

    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" href="/assets/icons/logo-192.png">
    <link rel="manifest" href="/manifest.webmanifest">

    <link rel="stylesheet" href="/styles/reset.css" />
    <link rel="stylesheet" href="/styles/typography.css" />
    <link rel="stylesheet" href="/styles/colors.css" />
    <link rel="stylesheet" href="/styles/layout.css" />
    <link rel="stylesheet" href="/styles/misc.css" />
  `;
};
