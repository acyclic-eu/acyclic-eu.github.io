---
layout: post
title: "Using AI to Rework Commits and Split Large Pull Requests"
date: 2026-05-03
---

I recently discovered a useful pattern while exploring a new feature. I had been creating commits along the way, but because I pivoted a lot during the exploration, the Git history became a messy work log. What I really needed was a purposeful change log.

It started with an attempt to rework my commits. I had some fixups and had done a lot of learning, which meant many changes simply reworked previous ones and were unnecessary for the final state.

In the next situation, I found that the total changes required for the feature were just too big. I thought about moving a self-sustained part out to its own pull request. I asked my AI assistant to extract it and verify that the final result was exactly the same after combining both branches.

That led me to think: what else can I extract to create more flexible PRs for my teammates to review? I asked the AI: *"How can we split this out into smaller, independent PRs?"*

In the end, I developed a few tricks to use when a change becomes too large and the Git history is unstructured. These prompts help me create a better overview and cleaner history:

### 1. Reworking Commits
Use this when you want to rewrite a messy history into clean, test-driven steps.
**Prompt:** *"Save the current state. Based on the commits and changes since [trunk/main/master] - Create new atomic commits with preferably 1 test per commit and a clear purpose for each commit. Compare the final state with the starting state to ensure they match."*

### 2. Splitting Branches and Pull Requests
Use this when a single PR has grown too large for a comfortable review.
**Prompt A:** *"Extract [Component/Feature] to its own PR/branch."*
**Prompt B:** *"How can the changes since [trunk/main/master] be split into different self-contained PRs?"*

Using variations of this approach has immensely helped me organize and untangle my work when my local changes become a bit unruly.

Try it out and tell me how it works in your setup.