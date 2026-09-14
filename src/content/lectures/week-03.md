---
title: Reading a power trace
description:
  Differential power analysis, and why a device's current draw is close to
  a printout of the arithmetic it is doing
week: 3
date: 2027-03-08
teachers:
  - marisol-quaye
slides: /decks/week-03/
related:
  - sessions/03-tracing-by-hand
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
operation and a single multiply produce, before the Bench and Assignment 1
ask you to do the harder version — many traces, added together — yourself.

## Outline

- what a power trace looks like for a single, known operation
- simple power analysis (reading one trace by eye) versus differential power
  analysis (correlating many)
- what "power analysis countermeasure" means at the hardware level, ahead of
  week 11's software-level treatment of the same problem
