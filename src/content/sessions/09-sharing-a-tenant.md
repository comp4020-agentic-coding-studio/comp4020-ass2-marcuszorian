---
title: Sharing a tenant
description:
  Working out, from the outside, whether two processes are colocated on the
  same physical machine
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
spec:
  - you can list at least two observable signals that suggest colocation on
    shared cloud hardware
  - you can distinguish, in supplied data, a colocation signal from ordinary
    network noise
  - you can state what a cloud provider changed to make the technique you
    used harder, historically
---

## Before the Bench

Read the placement-checking section of the week's readings before arriving —
this Bench works from supplied data rather than a live cloud account.

## In the Bench

Using supplied round-trip-time and shared-cache-contention data from pairs of
cloud instances, decide which pairs were probably colocated on the same
physical host and which were not. The exercise sits one layer up from week
6's cache measurement: there the question was which addresses a neighbour
touched, here it is whether a neighbour exists on the same hardware at all,
which is the precondition every cross-tenant channel in this course's second
half depends on.

## Afterwards

Note which signal you trusted most. Providers have spent a decade making
exactly that signal noisier — worth knowing which one you would reach for
first, and which one is likely already defended against.
