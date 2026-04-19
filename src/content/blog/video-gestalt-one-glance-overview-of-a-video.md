---
title: "Video Gestalt — One-Glance Overview of a Video"
slug: "video-gestalt-one-glance-overview-of-a-video"
date: 2023-03-19
excerpt: "[<video autoplay loop muted…"
---
[<video autoplay loop muted src="https://social-coop-media.ams3.cdn.digitaloceanspaces.com/media_attachments/files/110/045/643/010/816/155/original/6f6bbf570661a1b4.mp4" type="video/mp4"></video>][3]

Video Gestalt presents a condensed video array, showing the entire video at once as moving video thumbnails.

The above is an example of the Video Gestalt for a 50-second commercial for Vesta scooters. (Click the Video Gestalt to see the original video.)

As you can see, it is a looping video with moving thumbnails of the original video. In one second, you can see every frame of the original video at a glance, without any discontinuities as it loops. This is done by arranging that each thumbnail slides over exactly its width in one loop so that the next thumbnail takes over seamlessly.

When I was working in HP Labs on media and computational aesthetics in 2006, I came up with this technique. The original implementation used [AviSynth][2], a scripting environment for video processing. Unfortunately, it only ran on Microsoft Windows and worked only for the AVI video format, and was not suitable as a production tool, but it was a convenient way to hack together a demo.

I liked this idea and wanted to develop it more after I left HP, but I could not, because HP filed it as a [patent][1], and so had the IP locked up despite never taking advantage of it as far as I know.

However, I recently realized that the patent had expired because HP had failed to pay the patent fees, so I am now free to work on it again.

So I re-implemented it again, using the [MoviePy][4] library in Python. The code is open-sourced [on GitHub][5] and anyone who can run Python programs should be able to get it to run, following the instructions there.

It still needs some improvement. For one, it is quite slow, taking hours for a full-length movie.

Also, for long videos when the motion is slow, you can see that the motion is not smooth: it jumps forward one pixel at a time. That's because the MoviePy compositing I'm using does not seem to be able to use subpixel positioning (with aliasing) the way that AviSynth could.

But even so, it is already producing some nice results for longer videos, such as this one for a seven-minute Daffy Duck cartoon:

[<video autoplay loop muted src="https://social-coop-media.ams3.cdn.digitaloceanspaces.com/media_attachments/files/110/045/780/377/747/850/original/c59b5094230bc496.mp4" type="video/mp4"></video>][6]

Or this one for an 80-minute Rock Hudson movie:

[<video autoplay loop muted src="https://social-coop-media.ams3.cdn.digitaloceanspaces.com/media_attachments/files/110/045/801/282/946/480/original/9406dd32b2b638cc.mp4" type="video/mp4"></video>][7]

Hopefully, somebody will find this tool useful. 

[1]: https://patents.google.com/patent/US8301669B2
[2]: http://avisynth.nl/index.php/Script_examples
[3]: https://ia904607.us.archive.org/11/items/vespa-scooter-commercial/Vespa%20Scooter%20Commercial.mp4
[4]: https://zulko.github.io/moviepy/index.html
[5]: https://github.com/eobrain/videogestalt
[6]: https://ia800500.us.archive.org/11/items/DaffyTheCommandoRestored/Daffy%20-%20The%20Commando%20%28Restored%29-xFdG8lZ4PJw.mp4
[7]: https://ia600406.us.archive.org/31/items/rog561b_netzero_114/114.mp4
