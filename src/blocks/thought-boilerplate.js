import thoughtMetaData from "./thoughts-meta-data.json" assert { type: "json" };

export default (thoughtSlug) => /*html*/`
  <title>${thoughtMetaData[thoughtSlug].title} | Nicolaos Skimas</title>

  <link rel="stylesheet" href="/styles/components/site-header.css" />
  <link rel="stylesheet" href="/styles/components/thought.css" />
  <link rel="stylesheet" href="/styles/components/page-header.css" />
  <script type="module" src="/js/localize-time.js"></script>
`;
