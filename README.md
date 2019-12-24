# Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c740dd0-2db1-475f-b7cd-af9ab81a7bf6/deploy-status)](https://app.netlify.com/sites/dev-nicolaos/deploys)

This is the repo for my portfolio site. I have two goals for this project:

1. Zero Dependencies
2. Score 100 in every [Lighthouse](https://developers.google.com/web/tools/lighthouse/) category

_Note: Compatibility with legacy browsers is not a priority for this project_


## Development

### What's the deal with the two items files?

Great question future self, potential employer, or curious fellow dev!

The short version is [parsing JSON is way faster](https://v8.dev/blog/cost-of-javascript-2019#json) than parsing a JS object literal, but writing JSON by hand sucks. `dist/js/items.js` is what's actually used by the site, while `dist/js/items-source.js` contains a more human-friendly copy of the same data.

#### Updating the Utility Belt Items

1. Make the desired change to the data in `dist/js/items-source.js`
1. Using Deno or Node, run `dist/js/items-source.js`
1. Replace the data in `dist/js/items.js` w/the JSON output of the previous step

_TODO: Look into improving this process to automate the last step_
