# Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c740dd0-2db1-475f-b7cd-af9ab81a7bf6/deploy-status)](https://app.netlify.com/sites/dev-nicolaos/deploys)

This is the repository for my portfolio site. I have two goals for this project:

1. Zero dependencies
2. Score 100 in every [Lighthouse](https://developers.google.com/web/tools/lighthouse/) category

## Development

To start a dev server...

1. If not already installed (or out of date), run `npm i -g netlify-cli@latest`
2. In this project's root folder, run `deno run --allow-read --allow-write --unstable dev.ts`
3. If on Windows, open another terminal and run `netlify dev` from this project's root folder
    - This is due to a current limitation of `Deno.run`, see _dev.ts_ for more details
