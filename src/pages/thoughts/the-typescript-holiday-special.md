---
description: "Fluffy Bunny"
title: "The TypeScript Holiday Special"
layout: "../../layouts/ThoughtLayout.astro"
publishDate: "2022-12-25"
subTitle: "When a web developer is feeling whimsical in late December."
---

The following is the description of a [pull request] (<abbr>PR</abbr>) I put up at work a year or two ago, edited to remove obscure references specific to the project. Long story short: seemingly simple [TypeScript] (<abbr>TS</abbr>) migrations in can get surprisingly complicated. Merry Christmas!

## Prologue: Imagine This

You're a developer whose worked on a large, fullstack JavaScript (<abbr>JS</abbr>) application for a couple years and know how messy it can be. This year you receive a wonderful holiday gift: approval to start migrating to TypeScript! By implementing static typing your team can take a big step forward in improving the code's maintainability. So you decide to chip in and convert a file to TS; after all, _it'll only take a moment right?_

You select a random file with a couple small utility functions. But alas, upon giving it the `.ts` extension and adding the correct type annotations you're greeted by an unpleasant surprise: **the red squiggly line**. For a moment you wonder if maybe your editor is just trying to get into the holiday spirit with a colorful light show, but no other squiggles appear, no music starts, and you realize you'll actually have to deal with this. And thus begins the long journey to this complicated <abbr title="pull request">PR</abbr>.

## Chapter 1: A Global Environment

A quick hover reveals the issue: a reference to `window.env`. Thanks to the many moons you've spent digging through the codebase you know this is a safe reference because of two lines of code in the [NodeJS] server:

- One that passes environment variables to a view template
- One in the view template that sets the `window.env` client-side variable to those environment variables

Unfortunately, TypeScript hasn't spent nearly the time you have in this codebase and doesn't know about this yet. The definitions it comes with for `window` don't include a property `env`. Being the good teammate you are, you decide to give TypeScript a hand and let it know what's up.

## Chapter 2: A Definition File

Based on your past experience and a quick check with TypeScript's former teammates (who happen to live at 1 Google Way), you realize that the best way to tell TypeScript about this quirk of the codebase is with a definition file. So you add `global.d.ts` the root of the client with a bit of code that extends TypeScript's built in `Window` interface to include an `env` property.

TypeScript's mind is blown! But its thirst for knowledge is not so easily quenched. It wonders _What really is `window.env`?_. This seems like a reasonable request so you decide to flush it out for TypeScript.

## Chapter 3: The Explosion

The definition for what will become `window.env` lives in `app.js`, so you do a tiny bit of rearranging and export those values as `envData`. Then you pop back into `global.d.ts`, import the values, and add `typeof envData` as the type of `window.env`. You pat yourself on the back, knowing you've done a good <abbr title="pull request">PR</abbr>'s work and prepare to move on to other adventures.

...

Except you're not done; TypeScript decides to throw you a curve ball. Glancing back at your editor you notice another red squiggly line. Puzzled, you look into it and slowly come to the horrifying realization that TypeScript really has no idea what `envData` is. It thinks `envData` is just some random value (after all, it's coming from a <abbr title="JavaScript">JS</abbr> file right?) and thus can't be used as a type. This is the moment your shoulders slump, your mind blurs and everything in you groans. You realize for this to work, you'll have to convert `app.js` to TypeScript.

You'd always planned to convert it eventually. But the idea was to do this at the very end of the repository's migration because `app.js` sits at the very top of the server's dependency tree and TypeScript will expect all its dependencies to be properly typed. Doing it now with only a fraction of the dependencies converted would be insane.

Maybe its just the holiday spirit. Maybe its knowing you can't ship anything anytime soon because of the code freeze. Maybe its the extra energy provided by the added natural light of a rare snowfall. Whatever the case, you surprise even yourself and decide to go for it.

## Chapter 4: Handling Squiggles

> Ok what's a few missing types to clean up? Sure, I'll probably have to put in a few ignore comments for the deepest parts of the tree, but I can probably make some significant progress that'll benefit everyone with perhaps a day's worth of work.

These are the rationalizations you encourage yourself with as you begin to install <abbr title="Node Package Manager">npm</abbr> `@types` dependencies for the now squiggle filled `app.ts`.

At first you seem to be making quite a bit of progress. In fact, only two third party dependencies seem to have issues...

- `express-handlebars` doesn't have types published for it. Further research shows this is because the package itself has recently been converted to <abbr title="TypeScript">TS</abbr>. So you install the latest version, update the import statement to account for a breaking change, and watch another squiggle disappear.
- `@types/connect-timeout` marks the use of the package as invalid, but a look at the source code reveals the typings are incorrect. You slap an ignore on it, put up a <abbr title="pull request">PR</abbr> to the open source typings correcting the mistake and move on.

Now its down to handling first party squiggles. You got this! No definitions for the server's routes (the gateway to the rest of the untyped files)? Slap an `@ts-ignore` comment down, no need to blow up the scope of the work any further. Some of the functions in `app.ts`' have parameters that need types brought in from ExpressJS? No problem. We should be specifying an encoding in our use of a Node.js file API? Easy fix. At this rate you'll be done in no time.

## Chapter 5: The false summit

You convert a couple of small single file dependencies to TS successfully. The code's deprecated environment variables dependencies prove to be a bit more of a challenge, but a bit of refactoring eventually gets rid of their squiggles. Only a couple more to go.

One insists that a `buildTime` property doesn't exist on a type of `{}`. While you understand TypeScript's point, that's really not the case here. Sure the value in question can be an empty object, but it could also be of type `Build` which does have a `buildTime` property. You handle this case with the optional property accessor (`?.`), but TypeScript remains indignant that this will always be an empty object.

Exasperated, you reach out to a colleague for help. While he also don't understand TypeScript's behavior, he suggests refactoring the small bit of code that provides the possibly empty object to clear up this misunderstanding. This requires a slight edit to that file's other consumer, but you thank him for the advice and take the win.

All this leaves just one particularly annoying error cropping up in a couple places. TypeScript appears to have taken issue with our use of computed property access (`object[someValue]`). A bit of further research on your (now annoyingly) noisy type checker reveals this is due to its burning desire to be totally sure about everything. You tell it to chill out with an ignore in one spot (including a comment explaining the situation to future you and everyone else) and a type assertion in another.

Finally, you push to Git and open a draft <abbr title="pull request">PR</abbr>. A huge sigh of relief. Your work is finally done.

## Chapter 6: The CI Error Cycle

The CI pipeline blows up with errors immediately. It can't even build the application successfully. And thus begins the cycle:

CI fails --> Investigate error --> Fix Error --> Push changes --> Repeat

At first the errors are easy to fix, no doubt caused by the rapid expansion of scope taking up so much of your mental capacity. Forgetting to change some file extensions in the script used to run [Babel], a changed file that never got committed.

Now the app builds but tests fail all over. Your eyes have begun to droop and you wonder why you decided to do this. But you're in too deep now, you must press on.

Another visit to 1 Google Way points the finger at `babel-plugin-rewire` (a package the team is moving away from), though the tests that are failing don't actually make use of it. Rather than try and diagnose the specifics, you decide to employ a clever trick to make sure the tests and the problematic package stay separate. You use your now considerably leveled-up Google-fu to tweak the Babel config, isolating `babel-plugin-rewire` to some folders, while co-locating the problematic tests with their source code elsewhere.

Predictably, CI fails yet again. Silly you, you have to adjust import paths when you relocate test files! Try again.

Fail again. Two test suites this time. One's failure is bizarre yet straightforward, someone hardcoded `undefined` into an expected string path where an environment variable should have been used, and your refactor has upset that assertion. Fix it and move on. The other is another `babel-plugin-rewire` issue. You can't solve it by moving the file as its already co-located and altering the babel config feels messy to do for just one file. At this point you throw your hands up and just rewrite the test not to use rewire. It's doable and the new version is arguably more meaningful and readable.

## Chapter 7: Tunnel's End

You rub your tired eyes. Can it be? The type checker, linter, and tests **all pass in CI!** Sure, the security scanner complains about a few things, but an examination reveals none were introduced in your <abbr title="pull request">PR</abbr>. And what's more, its been long enough that the fix you submitted to `@types/connect-timeout` has been approved, merged, and released. With new life in your step you install the new version, remove the related ignore, and revel in another CI run passing.

## Epilogue

As you emerge from the dark rabbit hole, you ponder how to best get reviews for this work, given its convoluted nature. Then an idea sparks! A narrative! Its the holidays, many of your teammates are out and there is a code freeze in place, you got time. You grab a drink and sit down to write...

[babel]: https://babeljs.io/
[nodejs]: https://nodejs.org/en/
[pull request]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#about-pull-requests
[typescript]: https://www.typescriptlang.org/
