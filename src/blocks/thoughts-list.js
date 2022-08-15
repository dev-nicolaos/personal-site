import pagesMetaData from "./data/pages-meta-data.json" assert { type: "json" };

const createListing = ([url, listing]) => /*html*/`
  <li class="thought-listing">
    <a class="link thought-listing_title" href="/thoughts/${url}">
      ${listing.heading}
    </a>
    <time class="thought-listing_date datetime="${listing.publishDate}">${listing.publishDate}</time>
  </li>
`;

const sortListings = ([_url1, entry1], [_url2, entry2]) =>
  Date.parse(entry2.publishDate) - Date.parse(entry1.publishDate);

const filterThoughts = ([_url, { template = "" }]) => template === "thought";

const listings = Object
  .entries(pagesMetaData)
  .filter(filterThoughts)
  .sort(sortListings)
  .map(createListing)
  .join("");

export default /* html */`<ul class="thoughts-list">${listings}</ul>`;
