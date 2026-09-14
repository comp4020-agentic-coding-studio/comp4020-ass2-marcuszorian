---
title: A cloud is somebody else's computer, too
description:
  Cross-virtual-machine side channels, and what changes when the neighbouring
  process is a stranger's, not your own
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
related:
  - sessions/09-sharing-a-tenant
---

Public cloud computing runs many customers' virtual machines on the same
physical hardware, and week 6's cache-timing mechanism does not care whether
the two contending processes belong to the same user or to strangers who
have never met. Ristenpart, Tromer, Shacham and Savage's 2009 paper "Hey,
You, Get Off of My Cloud" showed both halves of the resulting threat in one
study: an attacker can determine, from published placement information, when
their instance is likely colocated with a target's, and can then use exactly
the kind of cache-contention signal week 6 introduced to extract information
across that colocation — no misconfiguration required, only the cloud's own
economics, which favour packing many tenants onto one machine.

The paper is as much about placement as about extraction, and this week's
Bench reflects that split: knowing a co-tenancy channel exists is only useful
once a defender knows how to tell whether they are exposed to it at all.
Providers have since made placement harder to infer, but the underlying
sharing that makes the channel possible is the same economic argument that
made public cloud computing viable in the first place, and is unlikely to go
away.

## Outline

- how a customer can infer colocation on shared cloud hardware
- what changes, and what does not, when week 6's channel is applied across a
  virtual-machine boundary instead of a process one
- what a provider can change here without giving up multi-tenancy altogether
