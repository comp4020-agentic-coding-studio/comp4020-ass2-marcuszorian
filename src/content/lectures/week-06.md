---
title: What a shared cache gives away
description:
  Reading a neighbouring process's memory-access pattern through nothing but
  the timing of your own cache hits and misses
week: 6
date: 2027-03-29
claim: >-
  Two programs that share nothing but a processor still share its memory
  hierarchy, and the timing of that hierarchy is enough.
channel: cache
teachers:
  - idris-fenn
related:
  - sessions/06-mapping-a-shared-cache
---

A processor's cache is shared between every process running on it, and a
cache hit and a cache miss differ by enough cycles to be told apart with an
ordinary timer. Yarom and Falkner's 2014 paper "FLUSH+RELOAD: a High
Resolution, Low Noise, L3 Cache Side-Channel Attack" turned that difference
into a practical technique in three steps: flush one line of memory out of
the cache, let the victim run, then time reloading that line. A fast reload
means the victim touched it; a slow one means it did not. Applied across a
cryptographic implementation's memory footprint, that single bit per line
per interval was enough to recover most of a private key from one observed
signing operation.

Two conditions on that result matter more than the technique itself, because
they are what the rest of the course inherits. First, FLUSH+RELOAD needs
memory *shared* with the victim — the attacker has to be able to name the
line it flushes, which in practice means a shared library or a hypervisor
that deduplicates identical pages. It is not a channel between two processes
that share nothing. Where that sharing is unavailable, the fallback is
PRIME+PROBE, which gives up naming the victim's addresses and instead fills a
cache set with its own data and watches for eviction: no shared memory
required, coarser resolution, more noise. Second, because `clflush` reaches
the last-level cache, which is shared across the whole package, attacker and
victim do not need the same core — which is precisely what made the result
practical rather than a laboratory curiosity.

Both conditions reduce to the same prerequisite: the attacker must be running
on the same physical hardware as the victim, and must know it. On a
single-user machine that is trivially true. On rented hardware it is neither,
and establishing it is a separate problem, which is week 9's.

## Outline

- hit versus miss in cycles: what makes the difference measurable from
  unprivileged code, and what a histogram of access times looks like
- the three-step primitive, and the two preconditions it actually requires —
  shared pages, and a last-level cache shared across cores
- FLUSH+RELOAD against PRIME+PROBE: what an attacker gives up when page
  deduplication is turned off, which is the defence most providers chose
- the scope boundary this course draws here: transient-execution attacks use
  this same cache as their read-out channel, but their *source* is
  speculative work that never architecturally happened, which is a different
  argument on different prerequisites and is not taught in this course
