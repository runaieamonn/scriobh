---
title: "Privacy"
slug: "privacy"
date: 2023-02-13
excerpt: "Overview eamonn.org is my personal website using the WriteFreely server software. You can reach me by sending me a Mastodon DM at @eob@social.coop. if you have…"
---
## Overview

eamonn.org is my personal website using the WriteFreely server software. You can reach me by sending me a Mastodon DM at @eob@social.coop. if you have any questions, need to submit a data subject request, want to tell me I'm wrong, or otherwise have thoughts.

## Cookies

The only cookies that eamonn.org places on your browser are two cookies used by Matomo open-source analytics software running on a server that I control. No data associated with the cookies is shared with any other person or entity.

## eamonn.org as a Controller

Under the General Data Protection Regulation (GDPR), eamonn.org acts as a _controller_ of your personal data in the following cases:

-   if you visit the eamonn.org website
-   if you "follow" the site from an account on another Fediverse server
    
## What types of personal data are processed?

I process the following types of personal data:
        
-   **Accounts that "follow"** Your Fediverse account information, so we can send an updates to your accounts inbox
        
-   **Website Visitors**: IP address
        
## Purposes for processing data


* **IP address and other machine identifiers** are collected by default in WriteFreely, presumably for the purposes of allowing mods to block/disable access to instances, to render the site properly on different devices, and because that is how the internet generally works.

Because the Fediverse (including instances of WriteFreely, Mastodon, and related platforms) is, in effect, a bunch of databases sharing data with one another, personal data is stored in databases (both a Sqlite database I control on GCP, and other databases controlled by other instance admins).

Some information (such as user access, registration, errors, etc.) are also stored in separate Linux system logs (SystemD), which are also maintained on GCP. These logs serve the purpose of maintenance and security of the server.

## Legal basis for processing data

I rely on **consent** obtained by the user's (third-party) ActivityPub service for processing follower information. I also rely on your consent if you contact me via DM at @eob@social.coop, or follow me on this instance.

In the unlikely event that you do something that violates the site rules, I rely on legitimate interests for subsequent processing (i.e., if necessary, reporting to authorities). If I am served with a legal order requiring me to provide information relating to you in connection with suspected or alleged misuse of the service, and I comply with that order, my lawful basis will be **necessity to comply with a legal obligation**.  

**Please don't let it come to that.**

I rely on **contractual necessity** and **legitimate interests** to host this instance and deal with DMs to @eob@social.coop.  I have agreements in place with GCP for hosting.  

## Retaining your data

The eamonn.org server attempts to delete content stored in logs automatically after 30 days, to make optimal use of server space. 

## Exercising your rights

You have the right to request access to and rectification or erasure of personal data. You can also ask us to restrict processing or object to processing (to the extent that's possible). 

To contact me, including to exercise your rights, please DM me at @eob@social.coop. 

## Security

Personal data processed by eamonn.org is accessible to only me. In addition to limited access, the following additional security measures are in place:
-   hourly, redundant backups of instance data;
-   encryption in transit (TLS 1.3, via LetsEncrypt);
-   encryption at rest on GCP

I rely on assurances provided by GCP regarding their own technical and organizational measures. Details on Sub-processor controls can be found below:

[GCP][2]



## Credit

This privacy policy is based on [Mastodon privacy policy template][1] by @privacat@dataprotection.social

[1]: https://codeberg.org/privacat/MastodonDataProtectionGuidance/src/branch/main/PrivacyNoticeTemplate.md
[2]: https://cloud.google.com
