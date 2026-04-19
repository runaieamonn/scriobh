---
title: "Building the \"Delayed Headlines\" ChatGPT Bot"
slug: "building-the-delayed-headlines-chatgpt-bot"
date: 2023-05-21
excerpt: "Last month, as described in [Building a Mastodon AI Bot][1], I built @elelem@botsin.space, an AI-powered bot that responds to anyone who mentions it. It's been…"
---
Last month, as described in [Building a Mastodon AI Bot][1], I built @elelem@botsin.space, an AI-powered bot that responds to anyone who mentions it. It's been running for a while, and has produced some interesting output, especially when caught in loops with other bots like @kali@tooted.ca and @scream@botsin.space ([Unleashing an AI Bot on Mastodon][2])

This weekend I tried creating another, less interactive bot. This one, @delayedheadlines@botsin.space, scrapes Wikipedia to find events that happened on this day in history 50, 100, 200, 300, etc. years ago. It then uses ChatGPT to summarize the historical events in the style of a tabloid headline. For example:

> Sunday, May 20, 1923:
> 
> SHOCKING! British Prime Minister RESIGNS due to CANCER!
> 
> MEDICAL advisers release DISTURBING announcement regarding Prime Minister's HEALTH!
> 
> KING GEORGE V graciously accepts RESIGNATION from Right Honorable A. Bonar Law!
> 
> ALSO: Mestalla Stadium OPENS in Valencia, Spain and former Russian Imperial Army General EXECUTED for TREASON!
> 
> https://en.m.wikipedia.org/wiki/May_1923#May_20,_1923_(Sunday)

![Architectural diagram of bot][4]

The source code is [on GitHub][3], comprising about 160 lines of server-side JavaScript, using pretty much the same architecture as for the @elelem@botsin.space bot.

```js
const accessToken = process.env.MASTODON_ACCESS_TOKEN
const mastodonServer = process.env.MASTODON_SERVER
const baseUrl = `https://${mastodonServer}`

const headers = {
  Authorization: `Bearer ${accessToken}`
}

export async function toot (status) => {
  const body = new URLSearchParams()
  body.append('status', status)
  await fetch(${baseUrl}/api/v1/statuses`, {
    method: 'POST',
    headers,
    body
  })
}
```

The Mastodon interface was the easiest, as it just needed a single `toot` function to post the status, which would be the tabloid headlines text. The nice thing is that the Mastodon REST API is so straightforward, that for simple cases like this there is no need to use a JavaScript library. You can just use the build-in `fetch` function.

Note the security  precaution of not including the Mastodon access token in the checked-in code. Instead I keep that in a non-checked in file and pass it to the running program in an environment variable.

```js
import { Configuration, OpenAIApi } from 'openai'

const STYLE = 'supermarket tabloid headlines'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export async function addPersonality (text) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `
  Rewrite the following text in the style of ${STYLE}:

  ${text}
  
  `
    }]
  })
  return completion.data.choices[0].message.content
}
```

For the LLM, I used a different API call than I did for Elelem. For that one I used the lower-level completion API, where you have full control of the context fed into the LLM, which for that bot was a Mastodon thread and some personality-setting instructions.

For this bot I just needed the LLM to rewrite one piece of text, so I used the higher level chat API, which is similar to the online ChatGPT app. It is significantly cheaper than the completion API.

```js
import { parse } from 'node-html-parser'

function filter (text) {
    ...
    if (line.match(/Born:/)) {
      on = false
    }
    ...
}

export async function thisDay (yearsAgo) {
  ...
  const monthUrl = `https://en.m.wikipedia.org/wiki/${monthString}_${year}`
  const monthResponse = await fetch(monthUrl)
    ...
    const monthHtml = await monthResponse.text()
    const monthRoot = parse(monthHtml)
    const ids = [
      `${monthString}_${day},_${year}_(${weekdayString})`,
      `${weekdayString},_${monthString}_${day},_${year}`
    ]
    const citations = []
    for (const id of ids) {
      const nephewSpan = monthRoot.getElementById(id)
      ...
      const parent = nephewSpan.parentNode
      const section = parent.nextSibling
      const text = filter(section.innerText)

      return { found, text, then, citation }
    ...
  }

  const yearUrl = `https://en.m.wikipedia.org/wiki/${year}`
  const yearResponse = await fetch(yearUrl)
  ...
    const yearHtml = await yearResponse.text()
    const yearRoot = parse(yearHtml)
    const pattern = `${monthString} ${day} . `
    for (const li of yearRoot.querySelectorAll('li')) {
      if (li.innerText.match(pattern) && !li.innerText.match(/ \(d\. /))
        ...
        const text = li.innerText.slice(pattern.length)
        ...
        return { found, text, then, citation }
      ...
```

The most complex part of the app's code is the scraping of Wikipedia. It turns out that daily events are not stored in a very consistent way. For the last century or so there is a Wikipedia page per month, so the scraper has to find the section within the page, using one of two different patterns of HTML `id` attributes to find a nearby DOM element and navigate to the desired text. For older centuries there is a Wikipedia page per year, requiring a different way of finding the target day's events. In both cases I filtered out births, because headlines of the day would not know in most cases which births were significant.

What made writing this code easier was the `node-html-parser` library, which provides a browser-style DOM API to this server-side code.

So have a look at @delayedheadlines@botsin.space to see what headlines have been posted so far, and you might want to follow the bot if you have a Mastodon account. Or if you want to try rolling your own bot, you could use this code as a starting point.


[1]: https://eamonn.org/building-a-mastodon-ai-bot
[2]: https://eamonn.org/unleashing-an-ai-bot-on-mastodon
[3]: https://github.com/eobrain/thisday
[4]: https://docs.google.com/drawings/d/e/2PACX-1vQCFKYVY7_EVacaUDBeRNNUgIk1jdr_aU2Wi48ysNj3cd0TEK-jB076tmLPy07lJc0kDIlmMB9_5yPc/pub?w=856&h=507
