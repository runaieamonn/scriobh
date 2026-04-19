---
title: "Is there a Theoretical Limit to LLM-based Safety Critics?"
slug: "is-there-a-theoretical-limit-to-llm-based-safety-critics"
date: 2026-01-25
excerpt: "A common technique in AI Safety is to use an additional LLM (a “critic”) to verify that a response is safe. But the “Hallucination Stations” paper [(Sikka &…"
---
A common technique in AI Safety is to use an additional LLM (a “critic”) to verify that a response is safe.

But the “Hallucination Stations” paper [(Sikka & Sikka 2025)][1] suggests a hard theoretical limit to this approach.

The paper demonstrates that an LLM cannot strictly solve or verify problems that exceed its internal computational complexity (roughly O(n²)). If asked to solve a more complex problem, it is mathematically forced to hallucinate a statistically probable answer.

The problem for us in AI Safety: Verifying safety is often strictly harder than generating text.

A robust safety check isn't just a keyword scan. It requires verifying the logical consistency of a response against complex, interacting policies (bias, privacy, jailbreaks, illegal content, hate speech, dangerous weaponry, etc.) across a full conversation history. This creates a combinatorial state explosion, probably pushing the verification task into exponential complexity, or certainly far beyond the O(n²) limit of the critic itself.

The Result: The critic may confidently label a response as “safe” simply because it’s statistically safe, even when it fails a complex logical constraint.

The Way Forward: Rather than rely on "LLMs all the way down.", the critic can be part of a hybrid system—capable of generating code or calling deterministic tools to offload the high-complexity verification tasks that the LLM theoretically cannot handle.

[1]: https://arxiv.org/pdf/2507.07505
