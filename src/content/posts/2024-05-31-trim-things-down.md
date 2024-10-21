---
layout: ../../layouts/post-layout.astro
title: Trim things down
issue: 107
date: 2024-05-31T06:21:41.629Z
---

It's been around 5 months since the last time I changed my blog engine, and I kept adding functions, features, and configs to it, and it's making the blog worse.

## Stereotype of a blog

The first blog engine I ever used is WordPress, so naturally I thought, a blog’s index page should have a default structure like this:

- Post list
- Tags
- Friends page
- Recently posted
- Recent comments
- Search bar
- Archives
- Contact info
- ...

Switching to other blog engines like Jekyll, Hexo, etc., didn’t really stop this stereotype from being in my mind until I started to think, what do i really need?

## The purpose of a blog, at least this blog

As I once wrote down these words in one of my blog:

- record the learning progress
- post some fun stuff

And that’s it, I don’t need tags to tell people what I write about, I don’t need a friends page to tell people that i’m cool and has a lot of friends, I don’t need things that people just don’t care about,  how many people would just come to your blog and search for a specific article? The answer is probably *no one*, so why bother 🤷🏻‍♂️?

## Goodbye then

- **Date in URL**: Most of my blogs are migrated from Jekyll and Hexo, for SEO purposes i still made the same URL pattern even after I switched to Astro, my new blogs’ url will no longer have this date thing, starting with this one.
- **Words count and Tags in posts**: People would just stop reading your blog if the content is not that interesting, adding words count and tags does not make your blog cooler.
- **Photos page**: You’re not a professional photographer, adding this page is just pure cringe.
- **Markdown renderer in comment section**: 54kb trimmed at the client side, big win!
- **Extra CSS at the index page**: 4kb trimmed and an extra request saved.
- **PNG favicon**: changed to SVG, 8kb trimmed.
- **Vue**: changed to SolidJs, 27kb trimmed.
- **Open Graph for each post**: again, doesn’t matter and unnecessarily increase maintenance efforts, left only one OG for the whole blog.

## ~~Things I couldn’t get rid of, for now~~

- **Friends page**: guess friends do matter, ~~we have this little tradition in Chinese bloggers circle called “Link Exchange”, works like a traffic attraction mechanism for blogs.~~
- **Comments**: ~~I kinda liked to get connected with people, and since the comment section is made with GitHub Issues, I barely get spams, so yeah, this is a keep.~~

## And dear English bloggers, I envy you

Fonts play an important role in the making of clean blogs, English has at most 26 letters, and these are the building blocks for the whole English world, meaning you can apply any web fonts without worrying about the size and loading speed.

In Chinese, Fonts and Words work a LITTLE bit differently, we also have some certain building blocks but those blocks bundle as one letter, thus we have thousands of “letters” 🤷🏻‍♂️, custom fonts would just become a nightmare, it struggles me a lot when there are some freaking amazingly looked Chinese fonts, but you can’t use them because of the loading speed.

From the perspective of design, Chinese are also kinda hard to compose. So, for an ultimate clean look I’ve decided to write a blog in English, which is the one you’re reading now, please don’t make fun of my grammar, I tried.

And I’m pretty happy with it. 👻

## Final thoughts

I don’t wanna say anything like “less is more”, I believe you’ve heard it a million times just like “with great power comes great responsibilities 🕸 ”.

These are just my opinions, and I believe that you can do anything to your blogs, it’s just the way I like:

clean and content-focused.
