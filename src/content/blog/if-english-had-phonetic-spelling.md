---
title: "If English had Phonetic Spelling"
slug: "if-english-had-phonetic-spelling"
date: 2023-03-01
excerpt: "> # If Inglish had Funetik Speling One of my favorite podcasts is [The History of English Podcast][1], and one fascinating thread of the story is all the…"
---
> # If Inglish had Funetik Speling

One of my favorite podcasts is [The History of English Podcast][1], and one fascinating thread of the story is all the myriad ways in which English spelling ended up up in its current highly irregular state. There is no one reason, but layers of complexity that built up over the centuries as the spoken language continued to evolve.

> Wun uv miy fayverit podcasts iz [Thu Histeree uv Inglish Pawdkast][1], and wun fasunayting thred uv thu stawree iz awl thu mireeud wayz in which Inglish speling endud up up in its kerunt hiylee iregyuler stayt. Ther iz noe wun reezun, but layerz uv kumpleksitee that bilt up oever thu senchereez az thu spoekun langgwuj kuntinyood too ivaalv.


What if English spelling had the same property as some other languages, such as Spanish, where the spelling follows directly from the pronunciation?

> Whut if Inglish speling had thu saym praapertee az sum uther langgwujuz, such az Spanish, wher thu speling faaloez derektlee frum thu proenunseeayshun?

In an attempt to answer that question that I created a phonetic spelling system for English. To see what it looks like, see the interspersed paragraphs in this article which repeats the previous paragraphs, but with the phonetic respelling.

> In an utempt too anser that kweschun that IY kreeaytud u funetik speling sistum fer Inglish. Too see whut it luhks liyk, see thu intersperst parugrafs in this aartikul which ripeets thu preeveeus parugrafs, but with thu funetik respelling.

I wrote a *Phonate* library to do this. It considers English to have 40 phonemes, 15 of them vowels, and maps each phoneme to one or two letters. See the table of phonemes and spellings in the [README with the source code][2] which shows how *Phonate* library does this.

> IY roet u *Phonate* liybreree too doo this. It kunsiderz Inglish too hav 40 foeneemz, 15 uv them vouulz, and maps eech foeneem too wun er too leterz. See thu taybul uv foeneemz and spelingz in thu [README with thu sawrs koed][2] which shoez hou *Phonate* liybreree duz this.


Some things to note about this spelling scheme:

> Sum thingz too noet ubout this speling skeem:


* It does not use any letters that do not exist in English (in fact it drops two, q and x, as being redundant).
* It does not use any accents on characters.
* It tries to use the most common existing English spelling for each phoneme, except where that leads to ambiguity or conflicts.

> * It duz naat yoos enee leterz that doo naat igzist in Inglish (in fakt it draaps too, kyoo and eks, az beeing ridundunt).
> * It duz naat yoos enee aksents aan karikterz.
> * It triyz too yoos thu moest kaamun igzisting Inglish speling fer eech foeneem, iksept wher that leedz too ambigyooutee er kunflikts.

Note, the spelling being phonetic means that all words that sound the same are pronounced the same, for example in the sentence "I want **to** have **two** chocolates **too**".

> Noet, thu speling beeing funetik meenz that awl werdz that sound thu saym aar prunounst thu saym, fer igzampul in thu sentuns "IY waant **too** hav **too** chawkluts **too**".


I'm not sure if this is actually useful, given that clearly people are not going to change how they spell English. Maybe it has some use in learning English, being used as a pronunciation guide that is more readable to most people than the phonetic symbols sometimes used in dictionaries.

> Iym naat shuhr if this iz akchlee yoosful, givun that klirlee peepul aar naat goeing too chaynj hou thay spel Inglish. Maybee it haz sum yoos in lerning Inglish, beeing yoozd az u proenunseeayshun giyd that iz mawr reedubul too moest peepul than thu funetik simbulz sumtiymz yoozd in dikshunereez.


If you want to try this out yourself, you can try the [online converter][3].

> If yoo waant too triy this out yerself, yoo kan triy thu [awnliyn kunverter][3].


[1]: https://historyofenglishpodcast.com/
[2]: https://github.com/eobrain/phonate#readme
[3]: http://funetik.site/
