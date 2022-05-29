# Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c740dd0-2db1-475f-b7cd-af9ab81a7bf6/deploy-status)](https://app.netlify.com/sites/dev-nicolaos/deploys)

This is the repository for my portfolio site which hosts my resume and thoughts. I have two goals for this project:

1. Use zero dependencies (save for the runtimes provided by the browser for the site and Deno for the build system)
2. Have every page score 100 in every [Lighthouse](https://developers.google.com/web/tools/lighthouse/) category (not counting the PWA tests)

## Development

### Folder Structure

The site uses a custom build system written in [Deno](https://deno.land) to generate prebuilt static files that can be easily hosted or deployed to a CDN. The source files that are used to build the site fall into 3 categories, described below.

#### Static Files

Static files live in `src/www`. This folder will be directly copied to the root of the distribution folder at build time without modification. Good for styles, images, and runtime JS modules.

#### Pages

Pages are the content of the site and live in `src/pages`. Each page should live in an `index.html` file where the name of its parent folder will serve as the URL. These are standard HTML pages, except that they can invoke blocks with the `{{ block-name }}` syntax, where `block-name` is a block file's name sans file extension.

#### Blocks

Blocks are JS or TS modules that generate and inject reusable chunks of HTML into pages at build time. Blocks live in `src/blocks`. Each block must have a default export that is either...

- A string of HTML
- A function that returns a string of HTML
  - The function will be passed a string argument which is the URL slug of the page invoking the block

### Building the Site

Deno's standard modules are still currently unstable, so it is advisable to use the specific version of Deno referenced in _netlify.toml_ that is guaranteed to work with the version of the standard modules referenced by the build scripts. The build command is `deno task build` and the output folder is `dist`.

### Starting a Dev Server

You will need both [Node](https://nodejs.org/) (to run the netlify dev server) and [Deno](https://deno.land/) (to run the build system) installed to run the dev server.

1. If not already installed (or out of date), run `npm i -g netlify-cli@latest`
2. In this project's root folder, run `deno task dev`
    - Builds site, starts a watcher to rebuild site on file change, and starts a netlify dev server
    - Any additional arguments will be passed on to the [`netlify dev`](https://cli.netlify.com/commands/dev/) command that starts the server
    - Note that it may take a few moments for the server to spin up
