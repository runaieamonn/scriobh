---
title: "How to Export a Blog from Writefreely"
slug: "how-to-export-a-blog-from-writefreely"
date: 2024-05-10
excerpt: "[WriteFreely][1] is a fantastic minimalist blogging platform with Fediverse integration. If you're self-hosting WriteFreely (like this blog!), it's wise to…"
---
[WriteFreely][1] is a fantastic minimalist blogging platform with Fediverse integration. If you're self-hosting WriteFreely (like this blog!), it's wise to maintain backups for peace of mind. Here's how to export your WriteFreely blog using a tool I created called [writefreely-export][2].

## Prerequisites:

1. Shell access to your WriteFreely server
2. Node.js installed (I recommend using nvm for managing Node.js versions – [installation instructions here][3])

## Steps:

Clone the repository and cd into it:

```sh
git clone https://github.com/eobrain/writefreely-export.git
cd writefreely-export
```
Ensure Node.js compatibility (if using nvm):

```sh
nvm use
```

Finally to do the export do

```sh
npm install
npm run export
```

This creates a `content` directory containing Markdown files of your WriteFreely posts.

## Using the Exported Files

One option is to import your Markdown files into a static site generator like [simplestblog][4]. This approach gives you a static backup and an alternate site. For example, this blog is mirrored at [mysimplestblog][5].

## Additional Notes:

Consider automating the export process for regular backups.

[1]: https://writefreely.org/ 
[2]: https://github.com/eobrain/writefreely-export
[3]: https://nodejs.org/en/download/package-manager
[4]: https://github.com/eobrain/simplestblog
[5]: https://eobrain.github.io/mysimplestblog/
