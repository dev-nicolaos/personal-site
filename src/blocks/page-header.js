import pagesMetaData from "./data/pages-meta-data.json" assert { type: "json" };

const buildHeaderBase = (heading, subHeading = '', noContent = false) => /*html*/`
  <hgroup class="page-header" ${noContent ? 'data-no-content' : ''}>
    <h1 class="page-header_heading">${heading}</h1>
    ${subHeading ? /* html */`
      <p class="page-header_subheading">${subHeading}</p>
    ` : ""}
  </hgroup>
`;

const thoughtHeader = (heading, subHeading, publishDate) => /*html*/`
  <header class="thought_header">
    ${buildHeaderBase(heading, subHeading)}

    <time datetime="${publishDate}">${publishDate}</time>
  </header>
`;

export default (pageSlug) => {
  const { heading, subHeading, template, publishDate } = pagesMetaData[pageSlug];

  switch (template) {
    case "thought":
      return thoughtHeader(heading, subHeading, publishDate);
    case "no-content":
      return buildHeaderBase(heading, subHeading, true);
    default:
      return buildHeaderBase(heading, subHeading);
  }
};
