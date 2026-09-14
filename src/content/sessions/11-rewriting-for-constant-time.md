---
title: Rewriting for constant time
description:
  Taking a function that leaks through its running time and rewriting it so
  the leak is gone, not just smaller
week: 11
date: 2027-05-03
teachers:
  - idris-fenn
spec:
  - your rewritten function's timing no longer correlates with the secret
    input, measured the same way week 4 measured the original
  - you can point to the specific branch or early return you removed
  - you can name one thing your rewrite made worse (code clarity, average-case
    speed, or similar)
---

## Before the Bench

Bring the timing harness from week 4's session — this week reuses it to
grade your own rewrite rather than a supplied example.

## In the Bench

Take a function you are given — deliberately written with an early-exit
comparison, much like week 4's — and rewrite it so every branch it takes is
independent of the secret. Then measure it exactly as week 4 measured the
original, and confirm the trend against agreement length is gone. Defence is
not the same skill as detection: it is entirely possible to correctly
diagnose a leak and still write a "fix" that only makes it harder to see.

## Afterwards

Keep both versions and both timing plots. They are the clearest single
before-and-after pair the course produces, and the closing lecture draws on
exactly this contrast.
