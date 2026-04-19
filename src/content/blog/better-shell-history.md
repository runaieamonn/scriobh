---
title: "Better Shell History"
slug: "better-shell-history"
date: 2023-02-18
excerpt: "I remember it being transformational when about 10 year ago I upped my command-line game considerably by discovering that I could search through my shell…"
coverImage: "https://api.atuin.sh/img/eob.png?token=2cff620e443be9f844f197a1a6db3f14e7b15fe9"
---
I remember it being transformational when about 10 year ago I upped my command-line game considerably by discovering that I could search through my shell history with `Ctrl+R`.

Now thanks to [Atuin][2] from @ellie@hachyderm.io I think there may be another quantum jump in my command-line productivity.

The same `Ctrl+R` now brings up a UI that looks like this:
![Screenshot of Atuin UI][3]

It also has a live GitHub-like activity chart, which should update live as I continue to use the command line with Atuin enabled:
![a chart showing my command-line activity][1]

Unsurprisingly, I learned that my most common command is `git status`.

I just installed it on my Linux laptop. I'll try installing it on a Chromebook too, and maybe on the Cloud server that runs this blog.

==================

**Edit** 2023-02-20 I also succeeded in installing and syncing on two more machines: a Google Cloud compute server and a Chromebook. The steps for these subsequent machines were as follows:

First on the original machine run
```sh
atuin key
```
Keep this window open as you will need to copy-paste if into the `login` phase below.

On the new machine:
```sh
bash <(curl https://raw.githubusercontent.com/ellie/atuin/main/install.sh)
atuin login
atuin import auto
atuin sync
```

The above worked fine on the Google Cloud compute server.  However on the Chromeboook I had to run
```sh
sudo apt install build-essential
```
to install the compiler.

Also I had to run the 
```sh
bash <(curl https://raw.githubusercontent.com/ellie/atuin/main/install.sh)
```
at least twice, because the install script could not find any ready-build binaries and had to install some Rust infrastucture to build them. 

[1]: https://api.atuin.sh/https://eamonn.org/img/eob.png?token=2cff620e443be9f844f197a1a6db3f14e7b15fe9
[2]: https://github.com/ellie/atuin
[3]: https://docs.google.com/drawings/d/1MNp8ajGitAsyJw4N8PWHwKHpCcmgnmQPJ-0vxB_mVlU/export/png
