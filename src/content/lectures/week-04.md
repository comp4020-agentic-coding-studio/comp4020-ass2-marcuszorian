---
title: Timing as a channel
description:
  When a comparison's running time depends on how much of the secret it
  agrees with, and how far that reaches over a network
week: 4
date: 2027-03-15
teachers:
  - marisol-quaye
related:
  - sessions/04-timing-a-comparison
  - assessments/trace-analysis-lab
---

An early-exit string or byte comparison — the kind almost every language's
standard library writes by default — takes measurably longer the more
leading bytes it agrees with before it finds a mismatch. Locally that
difference is a curiosity; Brumley and Boneh's 2003 paper "Remote Timing
Attacks are Practical" showed it survives a network round trip: timing an
OpenSSL server's responses to many crafted requests, from a machine with no
special access, was enough to recover an RSA private key used only inside
the comparison.

The result reframed timing from a local, physically-adjacent concern into a
remote one, which is why "constant-time" became a requirement for
cryptographic code rather than a nicety: any comparison against secret data
that can return early is a timing channel waiting for enough measurements to
average out the network's own noise. Assignment 1, due this week, asks for
exactly the kind of trace-reading judgement this half of the course has been
building — on material you have not seen walked through in advance.

## Outline

- why an early-exit comparison leaks, mechanically
- what changed between a local timing measurement and Brumley and Boneh's
  remote one
- what "constant-time" requires of code, previewing week 11's rewrite
  exercise
