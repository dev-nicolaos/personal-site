import pagesMetaData from "./data/pages-meta-data.json" assert { type: "json" };

const buildHeaderBase = ({ title, subtitle }) => /*html*/`
  <div class="page-header">
    <h1 class="page-header_heading">${title}</h1>
    ${subtitle ? /* html */`
      <h2 class="page-header_subheading">${subtitle}</h2>
    ` : ""}
    <hr class="page-header_divider">
  </div>
`;

const thoughtHeader = ({ title, subtitle, publishDate }) => /*html*/`
  ${buildHeaderBase({ title, subtitle })}

  <time class="thought_pub-date" datetime="${publishDate}">
    ${publishDate}
  </time>
`;

const noContentHeader = ({ title, subtitle }) => /*html*/`
  <main class="page-header" data-no-content>
    <h1 class="page-header_heading">${title}</h1>
    ${subtitle ? /*html*/`
      <p class="page-header_subheading">${subtitle}</p>
    `: ""}
    <hr class="page-header_divider">
  </main>
`;

const standardHeader = ({ title, subtitle }) =>
  buildHeaderBase({ title, subtitle });

export default (pageSlug) => {
  const pageMetaData = pagesMetaData[pageSlug];

  switch (pageMetaData.type) {
    case "thought":
      return thoughtHeader(pageMetaData);
    case "no-content":
      return noContentHeader(pageMetaData);
    default:
      return standardHeader(pageMetaData);
  }
};
