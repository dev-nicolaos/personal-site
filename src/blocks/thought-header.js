import thoughtsMetaData from "./data/thoughts-meta-data.json" assert { type: "json" };

export default (thoughtSlug) => /*html*/`
  <div class="page-header">
    <h1 class="page-header_heading">${thoughtsMetaData[thoughtSlug].title}</h1>
    ${thoughtsMetaData[thoughtSlug].subtitle ? /* html */`
      <h2 class="page-header_subheading">${thoughtsMetaData[thoughtSlug].subtitle}</h2>
    ` : ''}
    <hr class="page-header_divider">
  </div>

  <time class="thought_pub-date" datetime="${thoughtsMetaData[thoughtSlug].publishDate}">
    ${thoughtsMetaData[thoughtSlug].publishDate}
  </time>
`;
