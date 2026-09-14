---
title: The leakage taxonomy
description:
  Putting a common rubric under six weeks of individually distinct channels
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
slides: /decks/week-10/
related:
  - sessions/10-scoring-a-leak
---

Every channel covered so far has been argued individually, on its own
mechanism and its own disclosure. This lecture does the opposite: it takes
the same six axes — physical medium, attacker proximity required, whether
the leak is available during the computation or only after it, how much
information a single measurement carries versus how many measurements
statistics require, and cost to close — and places acoustic, electrical,
electromagnetic, cache, optical and thermal channels on all of them at once.

Mutual information is the tool that makes "how much a channel reveals" a
number rather than an impression, and the deck introduces it at the level
this course needs: enough to estimate, from a dataset pairing a secret with
noisy measurements of it, how many bits of the secret a given channel
actually carries. That number, not just the channel's name, is what the
capstone will ask you to produce for a channel and device of your own
choosing.

## Outline

- the six-axis taxonomy, applied across every channel covered so far
- mutual information as a way to quantify "how much this channel reveals"
- how to read the taxonomy as a defender's prioritisation tool, not just a
  classification exercise
