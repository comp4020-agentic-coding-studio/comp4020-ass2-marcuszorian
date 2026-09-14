---
title: Mapping a shared cache
description:
  Timing memory accesses to work out, without any special privilege, which
  cache lines a second process touched
week: 6
date: 2027-03-29
teachers:
  - idris-fenn
spec:
  - you can distinguish a cache hit from a cache miss in your own timing data
  - you can identify which of several supplied memory addresses a second,
    concurrently-running process accessed
  - you can say what privilege level this technique required and what it did
    not
---

## Before the Bench

Confirm your machine's cache line size and roughly how many cycles separate a
hit from a miss on it — the deck's outline names where to find both.

## In the Bench

Time your own repeated accesses to a set of addresses while a supplied
background process runs, evicting some of them and not others on a schedule
you do not control. Sort your timings into hits and misses, and match the
pattern against which addresses the background process was told to touch.
Nothing here needed administrator rights, a debugger, or a bug in the other
process — that absence of privilege is the entire reason this class of
channel is hard to close by policy alone.

## Afterwards

Keep your hit/miss classification. Week 10's Bench asks you to score several
channels, including this one, against a common rubric.
