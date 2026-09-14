---
title: Reading a power trace
description:
  Differential power analysis, and why a device's current draw is close to
  a printout of the arithmetic it is doing
week: 3
date: 2027-03-08
claim: >-
  A single measurement can be unreadable while ten thousand of the same
  measurement are decisive: statistics, not sensitivity, makes a channel
  practical.
channel: power
teachers:
  - marisol-quaye
slides: /decks/week-03/
related:
  - sessions/03-tracing-by-hand
readings:
  - authors: Paul Kocher, Joshua Jaffe and Benjamin Jun
    year: 1999
    title: >-
      Differential Power Analysis
    venue: CRYPTO '99, LNCS 1666, 388-397
    url: https://doi.org/10.1007/3-540-48405-1_25
  - authors: Suresh Chari, Charanjit S. Jutla, Josyula R. Rao and Pankaj
      Rohatgi
    year: 1999
    title: >-
      Towards Sound Approaches to Counteract Power-Analysis Attacks
    venue: CRYPTO '99, LNCS 1666, 398-412
    url: https://doi.org/10.1007/3-540-48405-1_26
  - authors: Stefan Mangard, Elisabeth Oswald and Thomas Popp
    year: 2007
    title: >-
      Power Analysis Attacks: Revealing the Secrets of Smart Cards
    venue: Springer, chapters 6-9 on countermeasures
    url: https://doi.org/10.1007/978-0-387-38162-6
---

A transistor draws a different amount of current depending on whether it
switches from 0 to 1, from 1 to 0, or not at all, and a chip performing
arithmetic is switching enormous numbers of transistors in a pattern that
depends on the data it holds. Kocher, Jaffe and Jun's 1999 paper
"Differential Power Analysis" showed that this dependence survives
measurement: recording a smart card's power draw across many operations on
known and unknown data, then statistically correlating the recordings
against hypotheses about a secret key, recovers the key without ever
touching the card's logic directly.

The technique's importance is less the specific key it recovered than the
method: a single trace is close to unreadable by eye once the device is
doing real work, but the statistical correlation across thousands of traces
turns noise into signal in a way no single measurement could. This week's
deck walks through one trace slowly enough to see the shape a single squaring
operation and a single multiply produce, before the Bench and the Trace
Analysis Lab ask you to do the harder version — many traces, added together — yourself.

## Outline

- what a power trace looks like for a single, known operation, and the point
  at which a real workload stops being readable by eye
- the step from simple power analysis to differential: what the correlation
  is computed over, and why the number of traces is the attacker's real
  budget
- masking and blinding — randomising the intermediate values so that the
  correlation has nothing stable to find — and what that randomisation costs
  in silicon area and throughput
