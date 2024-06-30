---
title: "Site Changelog - May and June 2024"
description: "A brief recap of what's changed on this site recently."
pubDate: "2024-06-30"
---

The great thing about building a personal website/blog from scratch is that there are no limits on what you can do with it. The terrible thing about building a personal website/blog from scratch is that there are no limits on what you can do with it. Ideas start to piling up and what was supposed to be a fun way to share your ideas can become a never-ending checklist of unimplemented features.

Its been really nice having a little free time to work on this site lately. Here's a quick roundup of some of the changes I've made over the last couple months.

## Typography Refresh

### Fonts

I'd previously been using [Public Sans] for everything. It's a nice but somewhat boring font and it doesn't ship a variable version as a `.woff2` file. I ended up going way deeper down the typography rabbit hole than I expected and came back up with two new fonts: [Figtree] (for headings and body text) and [Trispace] (for code snippets). I was really impressed by how small the Figtree font files were and I think the font does a great job of being very readable while also having a little personality.

### Font Sizing

I also moved away from using "fluid typography" where font size calculations are directly based on the size of the viewport. That approach has some [accessibility concerns around scaling text], and I did not do (nor do I want to try and remember) [the math needed to ensure you don't cause an issue] with that approach.

My new approach to font sizes uses a simple combination of `rem`s and a couple media queries to account for the reader's default font size and screen size. It scales really nicely and only requires [a few lines of code].

## Redesigned Homepage and Navigation

The old homepage mainly consisted of large blocks of text that didn't feel very welcoming. I redesigned it to have shorter and more scan-able sections that link to other pages on the site with more details. I've also relocated my external profile links from the site wide navigation into one of the new sections to makes room in for a new internal page (see below). The navigation also uses `aria-current` as a styling hook for the link representing the current page.

## New Feed!

I've published an RSS feed for [my thoughts] for a little while now and if this post showed up in your reader you're probably subscribed to it. I describe the thoughts feed as "a series of posts about life, technology, and web development" and generally try to ensure those posts are somewhat well thought out.

There are times when I just want to quickly share something I think is cool. The thoughts feed doesn't really serve that purpose and I'm not active on any social media platforms. Instead, I've started up a new [Links and Likes] page with its own feed to celebrate other people's ideas and projects.

I've also created an "All Posts" feed that aggregates the posts from both feeds. Visitors to the site are now presented with the option to subscribe to any of these feeds.

[a few lines of code]: https://github.com/dev-nicolaos/personal-site/blob/main/src/styles/typography.css
[accessibility concerns around scaling text]: https://adrianroselli.com/2019/12/responsive-type-and-zoom.html
[my thoughts]: https://nicolaos.dev/thoughts/
[the math ]: https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
[Links and Likes]: https://nicolaos.dev/links-and-likes/
[Figtree]: https://www.erikdkennedy.com/projects/figtree.html
[Trispace]: https://etceteratype.co/trispace/
[Public Sans]: https://public-sans.digital.gov/
