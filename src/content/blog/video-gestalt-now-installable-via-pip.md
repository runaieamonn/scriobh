---
title: "Video Gestalt - Now Installable via Pip"
slug: "video-gestalt-now-installable-via-pip"
date: 2023-05-10
excerpt: "<video autoplay loop muted…"
---
<video autoplay loop muted src="https://pixelfed.eu/storage/m/_v2/496845204097878138/c537ce87c-f5971d/XK0nSvX5cK6Y/Bqp5L7Xp8N4XatulzOFTB3BdPkOaUixsxB76zeoI.mp4">

Thanks to [Stephen][1], who joined me as a maintainer of the [Video Gestalt][2] project and added production-quality Python packaging, it is now even easier to use Video Gestalt if you have a Python installed.

From the command line, simply do
```sh
pip install --upgrade videogestalt
```
Then if you have some video file called `kittens.mp4` you can create the gestalt video as a video file like so:
```sh
videogestalt -i kittens.mp4 -o gestaltkittens.mp4 --video
```
or as a gif file like so
```sh
videogestalt -i kittens.mp4 -o gestaltkittens.gif --gif
```
A command like this generated the example on the top of the page from from the classic 1977 [Powers of 10][3] movie.

See the previous blog post [Video Gestalt — One-Glance Overview of a Video][4] for the background.


[1]: https://github.com/lrq3000
[2]: https://github.com/eobrain/videogestalt
[3]: https://vimeo.com/466954086
[4]: /video-gestalt-one-glance-overview-of-a-video
