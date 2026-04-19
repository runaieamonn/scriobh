---
title: "Generalized continuous compiling (like sbt or coffeescript)"
slug: "generalized-continuous-compiling-like-sbt-or-coffeescript"
date: 2012-01-24
excerpt: "One of the really nice things about the sbt build system (for building Scala projects) or the coffeescript compiler is that they have a \"watch\" mode. When you…"
---
One of the really nice things about the sbt build system (for building Scala projects) or the coffeescript compiler is that they have a "watch" mode.

When you invoke a command in that mode (prepending with "~" (tilde) in sbt or adding the "--watch" argument to coffee) they continuously monitor your files and execute the compile or build action as soon as you save one of your source files to disk.  Some IDEs, such as Eclipse, have that feature too -- saving a file triggers an immediately compile.

But what if you are using an older build system like make, ant, or maven?

Well, if you are working on Linux, you can add this continuous build mode to any build system.

First, install `inotify-tools`, which on Ubuntu and similar distributions means doing:
```bash
sudo apt-get install inotify-tools
```

Then, for make, create an executable script called "~make" somewhere in your path with the following contents
```bash
#!/bin/sh -x

make $*
while inotifywait -e modify .
do
  make $*
done
```

Now where you would normally type
```bash
make something
```
you can type
```bash
~make something
```
and start editing files.  Every time you save a file the make will execute.

For ant, maven, or any other command-line build system, just modify the script to replace `make` in the two places it occurs.
