---
title: Scoring a leak
description:
  Attaching a number to how much a channel reveals, then using the numbers to
  build two rankings that disagree
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
spec:
  - you can compute a mutual-information estimate between a supplied secret
    and a supplied trace of measurements, and say how many samples your
    estimate needed before it stopped moving
  - you can place all seven channels from weeks 2 to 8 on the deck's six
    axes, using your own Bench measurements wherever you have them
  - you have produced two rankings — by attacker cost and by defender cost —
    and can name at least one channel whose position differs sharply between
    them, and why
---

## Before the Bench

Read the week's deck first: the six axes it introduces are the rubric this
Bench applies, not a separate topic. Bring every prior Bench's output — the
keystroke waveform, the annotated power trace, the timing plot, the shielding
costing, the cache hit/miss classification, the reflection notes, and week
8's fitted decay constant. This session is the first that consumes all of
them at once, and it is noticeably thinner without them.

## In the Bench

Three parts, in order.

**Calibrate.** Given a dataset pairing a secret value with many noisy
measurements of it, estimate the mutual information, then recompute the
estimate on the first 10, 100, 1,000 and all samples. Watch where it stops
moving. An estimator run on too few samples reports a leak that is not there,
which is the failure mode most likely to appear in your own capstone.

**Place.** Fill in the six-axis table for all seven channels. Four axes you
can complete from your notes. *Rate* and *volume* you will have to estimate,
and for most channels you will be estimating from a published figure rather
than your own data — mark which is which on your table, because a taxonomy
that hides the difference between a measurement and a citation is worth less
than one that does not.

**Rank, twice.** Order the seven channels by what it costs an attacker to
use each one, then order them again by what it costs a defender to close each
one. The two orders will not match. Find the channel that moves furthest
between them and be ready to defend your reasoning: that divergence is the
entire point of building a taxonomy, and it is the move the capstone asks you
to make on a device of your own.

## Afterwards

Keep the completed table and both orderings. The capstone asks for exactly
this analysis narrowed to one device and one adversary, which will strike out
most of the rows you just filled in — and knowing which rows a stated
adversary strikes out is most of what week 12 teaches.
