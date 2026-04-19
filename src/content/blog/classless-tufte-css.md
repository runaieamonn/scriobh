---
title: "Classless Tufte CSS"
slug: "classless-tufte-css"
date: 2024-04-28
excerpt: "I've long admired how the [Tufte CSS][1] project allowed you to create web pages in the style the legendary Edward Tufte developed. One improvement I've wished…"
---
I've long admired how the [Tufte CSS][1] project allowed you to create web pages in the style the legendary Edward Tufte developed.

One improvement I've wished for is the ability to use the Tufte CSS with well-structured semantic HTML, without requiring sprinkling `class` attributes around the CSS.

So I forked the project and created a new one called, which you can check out at: [Classless Tufte CSS][2].

You can try it out by including this in the `<head>` section of your HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/eobrain/classless-tufte-css@v1.0.1/tufte.min.css"/>
```

Your HTML requires no `class` attributes but should be in a standard semantic structure like this:

```html
<body>
  <article>
    <h1> title </h1>
    <p> subtitle </p>
    <section>
       <h2> section header </h2>
       ... paragraphs, lists, code blocks, figures etc
    </section>
    <section>
    ...
```

The main features lost in moving to the classless form were

* There is no automatic sidenote numbering
* The `<aside>`s used to implement margin material must be between paragraphs, they cannot be embedded in the middle of a paragraph.

There are some added features though:

* Lists that are in between paragraphs are also put in the margin.
* The margin material does not disappear for narrow screens. Instead, it is shown inline, indented.
* Code blocks have a subtle background shading
* Tables have some lines

Here is a comparison of the HTML between Tufte CSS and Classless Tufte CSS, so you can see the simplification.

||Tufte CSS|Classless Tufte CSS|
|---|---|---|
|All-caps initial text|`...<p><span class="newthought">A new thought</span> comes to me...`|`...<section><p>A new thought comes to me...`|
|Epigraph|`...<div class="epigraph"><blockquote><p>...`|`...</h2><blockquote><p>...`|
|Sidenote reference|`<label for="sn-extensive-use-of-sidenotes" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-extensive-use-of-sidenotes" class="margin-toggle"/>`||`<sup>1</sup>...</p>`|Label ("1" here) must be manually assigned|
|Sidenote|`<span class="sidenote">This is a sidenote.</span>`|`...</p><aside><sup>1</sup> This is a sidenote.</aside>`|
|Margin note|`<label for="mn-demo" class="margin-toggle">&#8853;</label><input type="checkbox" id="mn-demo" class="margin-toggle"/><span class="marginnote">This is a margin note. Notice there isn’t a number preceding the note.</span>`|`...</p><aside>This is a margin note. Notice there isn’t a number preceding the note.</aside>`|
|Fullwidth figure|`...<figure class="full-width">...`|`</section><figure>...`|
|iframe wrapper|`<figure class="iframe-wrapper"><iframe width="853" height="480" src="https://www.youtube.com/embed/YslQ2625TR4" frameborder="0" allowfullscreen></iframe></figure>`|`<figure><iframe width="853" height="480" src="https://www.youtube.com/embed/YslQ2625TR4" frameborder="0" allowfullscreen></iframe></figure>`|

What prompted me to do this is that I'm currently working to convert this blog to a static version, and I wanted to use Tufte CSS for plain semantic HTML generated from markdown.


[1]: https://edwardtufte.github.io/tufte-css/
[2]: https://eobrain.github.io/classless-tufte-css/
