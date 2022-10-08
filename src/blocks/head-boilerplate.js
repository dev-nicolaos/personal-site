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

    <style>
      /* RESET */
      html, body, div, span,
      article, aside, footer, header, main, nav, section,
      blockquote, h1, h2, h3, h4, h5, h6, hr, p, pre,
      a, abbr, br, cite, code, data, del, dfn, em, i, ins, kbd, mark, q, samp, strong, sub, sup, time, var, wbr,
      dd, dl, dt, li, ol, ul,
      audio, canvas, iframe, img, object, picture, svg, video,
      caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr,
      details, summary,
      button, datalist, fieldset, form, input, label, legend, meter, optgroup, option, output, progress, select, textarea {
        font: inherit;
        border: 0;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      /* TYPOGRAPHY */
      @font-face {
        font-display: fallback;
        font-family: Public Sans Web;
        font-style: normal;
        font-weight: normal;
        src: url(/assets/fonts/PublicSans-Regular.woff2) format('woff2');
      }

      @font-face {
        font-display: fallback;
        font-family: Public Sans Web;
        font-style: italic;
        font-weight: normal;
        src: url(/assets/fonts/PublicSans-Italic.woff2) format('woff2');
      }

      @font-face {
        font-display: fallback;
        font-family: Public Sans Web;
        font-style: normal;
        font-weight: bold;
        src: url(/assets/fonts/PublicSans-Bold.woff2) format('woff2');
      }

      html {
        font-family: Public Sans Web, Helvetica, Arial, sans-serif;
      }

      /* COLORS */
      :root {
        --color-accent: #5ca0a5;
        --color-back: #222222;
        --color-fore:  #ffffffdd;
        --color-primary: #5da562;
        --std-gradient: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
      }

      @media print {
        :root {
          --color-accent: #0a646b;
          --color-back: #ffffffdd;
          --color-fore: #222222;
          --color-primary: #0B6C12;
        }
      }

      html {
        background: var(--color-back);
        color: var(--color-fore);
        scrollbar-color: var(--color-accent) var(--color-back);
      }

      /* LAYOUT */
      :root {
        font-size: 1em;
        --spacing-base: .5rem;
        --spacing-0: var(--spacing-base);
        --spacing-1: calc(var(--spacing-base) * 2);
        --spacing-2: calc(var(--spacing-base) * 4);
        --spacing-3: calc(var(--spacing-base) * 8);
      }

      body {
        margin: auto;
        max-inline-size: 960px;
        padding: 0 5% var(--spacing-3) 5%;
      }

      @media print {
        /* Let the printing margins handle it */
        body { padding: 0; }
      }

      img {
        height: auto;
        max-inline-size: 100%;
      }

      /* MISC */
      .link {
        color: var(--color-primary);
        text-decoration: none;
      }

      .link:hover { text-decoration: underline; }

      .paragraph { line-height: 1.8; }
      .paragraph:not(:last-child) {
        margin-block-end: var(--spacing-2);
      }

      .blockquote {
        font-style: italic;
        line-height: 1.8;
        margin-inline: var(--spacing-1);
        text-align: left;
      }

      .blockquote :is(ol, ul) {
        list-style-position: inside;
      }
      .blockquote > *:not(:last-child) {
        margin-block-end: var(--spacing-1);
      }

      .list-item {
        list-style: inside disc;
        line-height: 1.8;
      }
      .list-item::marker { color: var(--color-primary); }
      .list-item[data-link]::marker { color: var(--color-fore); }

      .contents { display: contents; }
    </style>
  `;
};
