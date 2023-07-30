---
title: "Traffic Light Pull Request Reviews"
description: "A simple system for clearer feedback on Pull Requests"
pubDate: "2023-04-08"
tags: ["web-development"]
---

A large part of my work as a senior developer is reviewing other developer's code.
Our team uses pull requests (<abbr>PR</abbr>) in GitHub to review one another's work before merging it into the main branch of our codebase. In addition to leaving comments on individual lines of code, GitHub allows you to formally ["request changes" on a <abbr title="pull request">PR</abbr>](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request#submitting-your-review) as part of your review. Requesting changes blocks the <abbr title="pull request">PR</abbr> from being merged into the main branch until the reviewer's concerns are met.

Blocking a <abbr title="pull request">PR</abbr> can be helpful in communicating the seriousness of a concern, but unfortunately the block appears on a review itself rather than on one or more of the comments that make up that review. Thus unless you either isolate the blocking concern(s) to a separate review or explicitly call out "this comment is the blocker", there may be ambiguity for the author of the <abbr title="pull request">PR</abbr> about which comments are most important. Both of those methods are rather inelegant, so I use a simple system to weight my review comments.

Each comment I leave on a <abbr title="pull request">PR</abbr> gets prefixed with one of three emojis that represent the importance of the concern expressed in the comment.

- 🔴: This comment represents a concern that's causing me to block/request changes to the <abbr title="pull request">PR</abbr>
- 🟡: This comment represents a concern I'd like to dialog about before approving the <abbr title="pull request">PR</abbr>, but I won't block merging the <abbr title="pull request">PR</abbr> if others approve it
- 🟢: This is a random or unimportant comment, no need to reply

I post this legend in the summary of the first couple reviews I do for a new teammate to let them know what's going on. This "traffic light" system is an expansion of a system Kim Bradshaw (a former coworker of mine) used in her reviews which just made use of the red emoji to indicate blocking concerns. I've found these emoji prefixes provide helpful context at a glance for authors and other reviewers. We deal with enough ambiguity as developers, so I love finding simple ways to make our communication clearer.
