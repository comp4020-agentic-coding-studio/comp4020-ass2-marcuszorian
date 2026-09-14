---
title: Scoring a leak
description:
  Attaching a number to how much a channel actually reveals, instead of just
  noting that it reveals something
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
spec:
  - you can compute a mutual-information estimate between a supplied secret
    and a supplied trace of measurements
  - you can explain, in one sentence, why a channel can leak information
    without leaking the full secret
  - you can place two channels from earlier in the course on the same
    leakage-taxonomy axis from the deck
---

## Before the Bench

Read the week's deck first — the taxonomy it introduces is the rubric this
Bench applies, not a separate topic.

## In the Bench

Given a supplied dataset pairing a secret value with many noisy measurements
of it, estimate the mutual information between them and compare it against a
dataset where the pairing is closer to independent. The number itself matters
less than what it is for: "this channel leaks" is a claim with almost no
content until it is attached to how much, under what noise, and against how
many measurements — the same question the trace-reading and timing Benches
raised informally, now with a name and a formula.

## Afterwards

Keep your two estimates. The capstone asks you to make exactly this kind of
quantitative claim about a channel you choose yourself, not one supplied to
you.
