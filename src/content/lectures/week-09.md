---
title: Establishing that the hardware is shared
description:
  Colocation as a precondition every shared-hardware channel depends on, and
  as a problem a provider can defend on its own terms
week: 9
date: 2027-04-19
claim: >-
  Before a shared-hardware channel can be used it has to be found, and
  locating the sharing is a separate problem with its own separate defence.
channel: none
teachers:
  - marisol-quaye
related:
  - sessions/09-sharing-a-tenant
readings:
  - authors: Thomas Ristenpart, Eran Tromer, Hovav Shacham and Stefan Savage
    year: 2009
    title: >-
      Hey, You, Get Off of My Cloud: Exploring Information Leakage in
      Third-Party Compute Clouds
    venue: ACM CCS 2009, 199-212
    url: https://doi.org/10.1145/1653662.1653687
  - authors: Venkatanathan Varadarajan, Yinqian Zhang, Thomas Ristenpart and
      Michael Swift
    year: 2015
    title: >-
      A Placement Vulnerability Study in Multi-Tenant Public Clouds
    venue: USENIX Security 2015, 913-928
    url: https://www.usenix.org/conference/usenixsecurity15/technical-sessions/presentation/varadarajan
---

This week introduces no new channel, which is the reason it exists. Every
shared-hardware channel in this course — week 6's cache timing most
obviously, but equally the acoustic and thermal channels once the room is
shared rather than the silicon — carries a precondition that the previous
seven weeks quietly assumed: the attacker is already next to the victim. On
a machine you own, that is trivially true and not worth a sentence. On rented
hardware it is the whole problem, and it is defensible independently of the
channel it enables.

Ristenpart, Tromer, Shacham and Savage's 2009 paper "Hey, You, Get Off of My
Cloud" is the study that separated the two questions. Its extraction results
are, by this course's standards, weak — a coarse same-core cache-contention
measurement, five years before week 6's technique existed and far below it in
resolution. Its placement results are the contribution: the authors mapped a
commercial provider's instance-assignment policy from the outside, using
internal IP allocation and round-trip times, and showed they could then launch
instances until one landed on a chosen target's physical host, confirming the
landing cheaply. No misconfiguration was involved at any point. The enabling
condition was the provider's own economics, which reward packing tenants
densely.

Splitting the problem this way changes what a defender can do. The extraction
step is closed with the expensive, per-channel countermeasures the rest of
this course prices out. The placement step is closed with scheduling and
accounting: randomised assignment, dedicated hosts sold at a premium, and not
publishing the allocation structure an attacker maps from. Providers spent the
following decade on the second, because it is cheaper and it defends every
channel at once — which is the first appearance in this course of a defence
that is not channel-specific, and a preview of the argument week 12 closes on.

## Outline

- what a precondition is worth defending separately from what it enables
- how allocation structure and round-trip time were used to infer, and then
  arrange, colocation on a commercial provider
- why the placement defence generalises across channels while every
  extraction defence in this course does not
