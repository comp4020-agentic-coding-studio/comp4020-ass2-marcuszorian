---
title: What a shared cache gives away
description:
  Reading a neighbouring process's memory-access pattern through nothing but
  the timing of your own cache hits and misses
week: 6
date: 2027-03-29
teachers:
  - idris-fenn
related:
  - sessions/06-mapping-a-shared-cache
---

A processor's cache is shared between every process running on it, which
means one process can evict another's data from the cache without any
privilege to do so — and the second process can tell, because its own
accesses to that data become measurably slower afterwards. Yarom and
Falkner's 2014 paper "FLUSH+RELOAD" formalised this into a practical
technique: repeatedly evict a shared memory line, wait, then time reloading
it, and the timing alone reveals whether a co-resident process touched that
line in the interval — enough, applied across a cryptographic
implementation's memory footprint, to recover a private key from a process
sharing nothing with the victim but a CPU.

What makes this channel distinct from week 3's is the absence of physical
proximity: no probe, no oscilloscope, nothing but ordinary memory timing
available to any process the operating system scheduled onto the same core.
That is also why this channel resurfaces, in a different guise, in week 9's
treatment of cloud co-tenancy — the mechanism is the same cache, only the
tenants are virtual machines instead of processes.

## Outline

- how a cache hit and a cache miss differ in timing, and why that difference
  is measurable without privilege
- the FLUSH+RELOAD technique, mechanically
- why this channel is unusually hard to close without giving up cache
  sharing altogether
