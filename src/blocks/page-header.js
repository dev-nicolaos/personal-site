import pagesMetaData from "./data/pages-meta-data.json" assert { type: "json" };

const buildHeaderBase = ({ title, subtitle = '', noContent = false }) => /*html*/`
  <hgroup class="page-header" ${noContent ? 'data-no-content' : ''}>
    <h1 class="page-header_heading">${title}</h1>
    ${subtitle ? /* html */`
      <p class="page-header_subheading">${subtitle}</p>
    ` : ""}
  </hgroup>
`;

const thoughtHeader = ({ title, subtitle, publishDate }) => /*html*/`
  <header class="thought_header">
    ${buildHeaderBase({ title, subtitle })}

    <time datetime="${publishDate}">${publishDate}</time>
  </header>
`;

const noContentHeader = ({ title, subtitle }) =>
  buildHeaderBase({title, subtitle, noContent: true });

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
