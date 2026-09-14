---
title: Timing a comparison
description:
  Measuring how long a string comparison takes, and watching the measurement
  get more honest as the sample size grows
week: 4
date: 2027-03-15
teachers:
  - marisol-quaye
spec:
  - you can report the mean and spread of at least 10,000 timed comparisons
  - you can show a measurable difference between an early-exit comparison and
    a constant-time one, on the same input
  - you can say why a single timed run would not have been convincing
related:
  - assessments/trace-analysis-lab
---

## Before the Bench

Have a timing harness ready in any language: something that runs a comparison
function many times and records elapsed time per call, not just total time.

## In the Bench

Time two versions of the same secret-comparison function — one that returns
as soon as it finds a mismatched byte, one that always checks every byte —
against inputs that agree with the secret for a controlled, varying number of
leading bytes. Plot mean time against agreement length. The early-exit version
should show a trend; the constant-time one should not. Noise will be large
relative to the effect on a shared machine, which is itself the lesson: single
measurements lie, and the statistics are not decoration.

## Afterwards

The Trace Analysis Lab is due this week. It asks you to do the same kind of
reading —
trace to mechanism to conclusion — on material you have not seen annotated in
advance.
