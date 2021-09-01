# Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c740dd0-2db1-475f-b7cd-af9ab81a7bf6/deploy-status)](https://app.netlify.com/sites/dev-nicolaos/deploys)

This is the repository for my portfolio site. I have two goals for this project:

1. Zero dependencies
2. Score 100 in every [Lighthouse](https://developers.google.com/web/tools/lighthouse/) category

## Development

You will need both [Node](https://nodejs.org/) (to run the netlify dev server) and [Deno](https://deno.land/) (to run the build system) installed to run the site locally.

Deno's standard modules are still currently unstable, so it is advisable to use the specific version of Deno referenced in _netlify.toml_ that is guaranteed to work with the version of the standard modules referenced by the build scripts.

To start a dev server...

1. If not already installed (or out of date), run `npm i -g netlify-cli@latest`
2. In this project's root folder, run `deno run --allow-read --allow-write --unstable dev.ts`
3. If on Windows, open another terminal and run `netlify dev` from this project's root folder
    - This is due to a current limitation of `Deno.run`, see _dev.ts_ for more details

### Blocks

Blocks are chunks of HTML that can be dynamically generated and injected at build time so the deployed pages can be static.

#### Create a Block

- Create a Javascript or TypeScript file in _src/blocks_. The name of this file will be the name of the block.
- Export a default function from the block file. This function should take some data as an argument return an HTML string.
- To provide data to your block, create a JSON file in _src/blocks_ with the same name as the block file. The JSON will be parsed and then passed into the function exported by the block file. If this JSON file is not created, the function will receive `null` instead.

#### Include a Block

To include a block in your HTML, simply add `{{ my-block-name }}` wherever you want the block to be injected. This invocation will be replaced by the generated HTML in the build.
