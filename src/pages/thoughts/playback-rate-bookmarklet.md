---
description: "Use a JavaScript bookmarklet to adjust the playback speed of media on almost any page."
title: "Speed Up Web Audio and Video"
subTitle: "Works with one click on (almost) any page."
layout: "../../layouts/ThoughtLayout.astro"
publishDate: "2022-12-17"
---

**<abbr title="Too Long; Didn't Read">TL;DR</abbr>:** Bookmark the "link" below. Clicking the bookmark will speed up whatever content is playing on a page. The playback rate of the content will increase each time you click it until the content is playing at 2.5 times its original speed. If you click it again at that point the content will reset back to its original playback rate.

<a href="javascript:(()=>{const a=Array.from(document.querySelectorAll('video, audio')).find((a=>!a.paused));a&&(a.playbackRate=a.playbackRate>=2.5?1:a.playbackRate+.25)})();">Adjust Playback Rate</a>

<details>
  <summary>Limitations</summary>
  <p>This solution cannot control content that has been embedded on a page from an external site. For example, it can speed up a YouTube video if you're watching it on youtube.com, but not if its been embedded in an article on another site. That's because the code in this bookmarklet runs in the context of whatever site you're on, and there are some pretty significant security implications around letting one site run code on another. Its possible there are other edge cases that prevent this bookmarklet from working, but that's the only one I've found. Read on to learn how it works.</p>
</details>

## The Problem

I listen to a lot of audio and watch a lot of video on the web. One of my favorite features is the ability to adjust the playback rate of the content. I typically set it between 1.25 and 1.75 unless I'm watching sports or listening to a naturally fast speaker. I find the pacing more comfortable that way and appreciate the time it saves me, especially since some creators have a tendency to drag out content.

Browsers expose the option to control the playback rate of <abbr title="Hyper Text Markup Language">HTML</abbr> `<audio>` and `<video>` elements via the right-click context menu. Many sites have dedicated <abbr>UI</abbr> (user interface) controls that offer similar functionality, but every now and then I'll come across one where the browser's default control doesn't show up and the site's <abbr title="User Interface">UI</abbr> doesn't provide one either. It always frustrates me; just let me consume the content at my preferred pace.

## The Investigation

At some point I got curious as to how these sites were including the content on the page and popped open my browser's dev tools to poke around the code. I found there's usually an `<audio>` or `<video>` element somewhere on the page that's providing the content, but it's either hidden or covered by another transparent element making it un-clickable.

Once you find the content's source it only requires a few steps to adjust the content's playback rate, even it the page doesn't expose that functionality.

1. Select the relevant `<audio>` or `<video>` element in the _Inspector_ or _Elements_ panel of your browser's dev tools
1. In the _Console_ panel, reference the selected element with the `$0` JavaScript variable
1. Set the element's `playbackRate` property to your desired speed
1. Hit <kbd>Enter</kbd> to run the statement

This example will make the content play at 1.5 times its original speed.

```js
$0.playbackRate = 1.5;
```

## A One Click Solution

Its nice that this workaround is possible, but its a bit clunky (and that's from someone who spends nearly every workday using dev tools). Fortunately we can automate this process using [bookmarklets], a really cool feature of the web I recently learned about. Bookmarklet are just bookmarks where the URL is the string `javascript:` followed by a JavaScript [Immediately Invoked Function Expression][iife]. Here's the <abbr title="Immediately Invoked Function Expression">IIFE</abbr> I wrote to automate adjusting the playback speed of media.

```js
(() => {
  const pageMedia = Array.from(document.querySelectorAll("video, audio"));
  const playing = pageMedia.find((el) => !el.paused);
  if (playing) {
    playing.playbackRate =
      playing.playbackRate >= 2.5 ? 1 : playing.playbackRate + 0.25;
  }
})();
```

The script collects any `<audio>` and `<video>` elements on a page and finds the first one that's playing. If its `playbackRate` is greater than or equal to 2.5, it resets it back to 1. Otherwise, it increases the `playbackRate` by 0.25.

I've placed this code as the URL of a bookmark and now it never takes more than a single click to speed up the media I'm watching/listing to, even on those pesky sites with restrictive <abbr title="user interfaces">UIs</abbr>.

[bookmarklets]: https://www.freecodecamp.org/news/what-are-bookmarklets/
[iife]: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
