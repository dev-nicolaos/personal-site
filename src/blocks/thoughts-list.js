import thoughtsMetaData from "./data/thoughts-meta-data.json" assert { type: "json" };

const createListing = ([url, listing]) => /*html*/`
  <li class="thought-listing">
    <a class="link thought-listing_title" href="/thoughts/${url}">
      ${listing.title}
    </a>
    <time class="thought-listing_date datetime="${listing.publishDate}">${listing.publishDate}</time>
  </li>
`;

const sortListings = ([url1, entry1], [url2, entry2]) =>
  Date.parse(entry1.publishDate) - Date.parse(entry2.publishDate);

const listings = Object
  .entries(thoughtsMetaData)
  .sort(sortListings)
  .map(createListing)
  .join("");

export default /* html */`<ul class="thoughts-list">${listings}</ul>`;
