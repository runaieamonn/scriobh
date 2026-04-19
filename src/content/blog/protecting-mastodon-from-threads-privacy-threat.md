---
title: "Protecting Mastodon from Threads privacy threat"
slug: "protecting-mastodon-from-threads-privacy-threat"
date: 2023-07-08
excerpt: "TL;DR: Fediverse instances that federate with Threads could filter profiles to counter reidentification threats. The new Threads app has had a very successful…"
---
*TL;DR: Fediverse instances that federate with Threads could filter profiles to counter reidentification threats.*

The new Threads app has had a very successful launch, and they have said they will add ActivePub support allowing them to federate with Mastodon and other Fediverse instances.

This has caused a lot of angst on Mastodon, with many people philosophically opposed to interoperation with such a "surveillance capitalism" platform. Many instance operators have vowed to defederate from Threads, blocking the cross-visibility of posts and accounts between Threads and their instances.

However, @gargron@mastodon.social, the founder and CEO of Mastodon has [written positively][1] about allowing federation with thread, including saying

> Will Meta get my data or be able to track me?
> 
> Mastodon does not broadcast private data like e-mail or IP address outside of the server your account is hosted on. Our software is built on the reasonable assumption that third party servers cannot be trusted. For example, we cache and reprocess images and videos for you to view, so that the originating server cannot get your IP address, browser name, or time of access. A server you are not signed up with and logged into cannot get your private data or track you across the web. What it can get are your public profile and public posts, which are publicly accessible.

I decided to see how true this is, by looking at my own @eob@social.coop Mastodon account and looking to see what personal data of mine Meta would see if they were just fetching data that a well-behaved federated server would fetch.

I emulated the server-to-server calls that Threads would make when a Threads use looked me up on the Mastodon instance `social.coop` which hosts my account.

1.  Use webfinger to find my endpoints

    ```bash
    curl https://social.coop/.well-known/webfinger? 
    resource=acct:eob@social.coop 
    ```
2.  Amongst the data returned from the above is the link to my profile, which allows the profile information to be fetched

    ```bash
    curl  -H "Accept: application/json" https://social.coop/@eob
    ```
3.  In the profile are the links to my "outbox" URL `https://social.coop/users/eob/outbox` from where all my public posts can be fetched.

This seems fine so far. These posts are public anyway, so it's fine that Threads can see them.

However, there is a problem with Step #2 above. The profile data is not just pointers to URLs, but also a lot of other personal information. Here it is (converted from JSON to YAML, which is an easier format to read and with some boilerplate and media data removed):


```yaml
...
id: 'https://social.coop/users/eob'
type: Person
following: 'https://social.coop/users/eob/following'
followers: 'https://social.coop/users/eob/followers'
inbox: 'https://social.coop/users/eob/inbox'
outbox: 'https://social.coop/users/eob/outbox'
featured: 'https://social.coop/users/eob/collections/featured'
featuredTags: 'https://social.coop/users/eob/collections/tags'
preferredUsername: eob
name: Éamonn
summary: >-
  <p><a href="https://social.coop/tags/Privacy" class="mention hashtag"
  rel="tag">#<span>Privacy</span></a> <a href="https://social.coop/tags/UI"
  class="mention hashtag" rel="tag">#<span>UI</span></a> in <a
  href="https://social.coop/tags/SanFrancisco" class="mention hashtag"
  rel="tag">#<span>SanFrancisco</span></a>, leading a team building UI changes
  giving transparency and control over personal data in a large search
  engine.</p><p>Previously infrastructure for developer tools. Earlier HP Labs
  (IoT and computational aesthetic), a dot-com bust startup, and  high level
  chip design software at Cadence, Bell Labs, and GEC Hirst Research
  Centre.</p><p><a href="https://social.coop/tags/Irish" class="mention hashtag"
  rel="tag">#<span>Irish</span></a> born and bred, now living in Northern
  California.</p><p>Opinions here are my own; I&#39;m definitely not speaking
  for my employer.</p><p><a href="https://social.coop/tags/tfr" class="mention
  hashtag" rel="tag">#<span>tfr</span></a> <a
  href="https://social.coop/tags/fedi22" class="mention hashtag"
  rel="tag">#<span>fedi22</span></a></p>
url: 'https://social.coop/@eob'
manuallyApprovesFollowers: false
discoverable: true
published: '2022-10-29T00:00:00Z'
devices: 'https://social.coop/users/eob/collections/devices'
alsoKnownAs:
  - 'https://sfba.social/users/eob'
publicKey:
  id: 'https://social.coop/users/eob#main-key'
  owner: 'https://social.coop/users/eob'
  publicKeyPem: |
    -----BEGIN PUBLIC KEY-----
    MIIBIjA...AQAB
    -----END PUBLIC KEY-----
tag:
...
attachment:
  - type: PropertyValue
    name: Born
    value: 'Dublin, Ireland'
  - type: PropertyValue
    name: Lives
    value: 'San Francisco, USA'
  - type: PropertyValue
    name: Pronouns
    value: he/him
  - type: PropertyValue
    name: GitHub
    value: >-
      <a href="https://github.com/eobrain" target="_blank" rel="nofollow
      noopener noreferrer me"><span class="invisible">https://</span><span
      class="">github.com/eobrain</span><span class="invisible"></span></a>
endpoints:
  sharedInbox: 'https://social.coop/inbox'
icon:
...
image:
...
```

We can assume that Threads would put all this data into a Meta database keyed off my Mastodon identifier `@eob@social.coop` or equivalent.

I also have a Facebook and Instagram account, which is also stored in a Meta database, keyed off my Facebook user ID.

The big question, and the privacy threat model, is whether Meta can associate ("join") these two database entries as belonging to the same person so that they can use Mastodon data to optimize ad targeting and feed algorithms.

The good news is that the profile data above does not include an explicit data field that could be used as a joining identifier.

But there is a lot of free-form text that could be fed into matching algorithms,  and even though I was a little careful, by for example not including my last name, I suspect that Meta could reidentify me and associate the Mastodon account with my Facebook account.

So one response to this would be to ask people on Mastodon to edit their profiles to make them more anonymous, as most people did not write them on the assumption that the data would be fed into the maw of the Meta ad machine.

But maybe a better solution would be to modify the ActivityPub software in the server to filter out identifying profile information when federating with an instance like Threads.  For example:

* The `attachments` section could be removed as it has easily harvested structured personal data
* The `summary` section could be replaced with a link to the profile on the Mastodon server, so the human could click through and see it, but Meta servers would not. 

The result would be something more privacy-preserving like:

```yaml
...
id: 'https://social.coop/users/eob'
type: Person
following: 'https://social.coop/users/eob/following'
followers: 'https://social.coop/users/eob/followers'
inbox: 'https://social.coop/users/eob/inbox'
outbox: 'https://social.coop/users/eob/outbox'
featured: 'https://social.coop/users/eob/collections/featured'
featuredTags: 'https://social.coop/users/eob/collections/tags'
preferredUsername: eob
name: Éamonn
summary: ´<a href=¨https://social.coop/@eob¨>profile</a>´
url: 'https://social.coop/@eob'
manuallyApprovesFollowers: false
discoverable: true
published: '2022-10-29T00:00:00Z'
devices: 'https://social.coop/users/eob/collections/devices'
alsoKnownAs:
  - 'https://sfba.social/users/eob'
publicKey:
  id: 'https://social.coop/users/eob#main-key'
  owner: 'https://social.coop/users/eob'
  publicKeyPem: |
    -----BEGIN PUBLIC KEY-----
    MIIBIjA...AQAB
    -----END PUBLIC KEY-----
tag:
...
attachment:
endpoints:
  sharedInbox: 'https://social.coop/inbox'
icon:
...
image:
...
```



[1]: https://blog.joinmastodon.org/2023/07/what-to-know-about-threads/
