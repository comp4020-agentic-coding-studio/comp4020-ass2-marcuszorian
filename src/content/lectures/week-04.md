---
title: Timing as a channel
description:
  When a comparison's running time depends on how much of the secret it
  agrees with, and how far that reaches over a network
week: 4
date: 2027-03-15
claim: >-
  A channel needs no physical access at all: a clock at the far end of a
  network is a probe, and duration is the quantity it measures.
channel: timing
teachers:
  - marisol-quaye
related:
  - sessions/04-timing-a-comparison
  - assessments/trace-analysis-lab
---

This week has two mechanisms, deliberately, because the obvious one and the
consequential one are not the same. The obvious one: an early-exit string or
byte comparison — the kind almost every language's standard library writes by
default — takes measurably longer the more leading bytes it agrees with
before it finds a mismatch. It is a single branch, it is easy to see, and it
is what this week's Bench measures. On a local machine the difference is a
few nanoseconds and a curiosity.

The consequential one is subtler and carries none of that legibility.
Brumley and Boneh's 2003 paper "Remote Timing Attacks are Practical"
attacked OpenSSL's RSA decryption, where there is no comparison against a
secret at all. The dependence is arithmetic: Montgomery multiplication ends
with a conditional subtraction — an "extra reduction" — whose frequency
varies with how close the input is to one of the key's prime factors, and
OpenSSL separately switches between Karatsuba and normal multiplication at a
size boundary that the same input crosses. The two effects push the running
time in opposite directions, and which dominates depends on the machine. By
timing many decryptions of chosen inputs from another host on the same
network and watching where that combined signal turns over, the authors
recovered a factor of the modulus a few bits at a time.

Holding the two together is the week's real content. A timing channel is not
a category of bug — an early return — but a property of any operation whose
duration depends on secret data, including operations whose data dependence
is a statistical residue of an optimisation nobody thought of as a branch.
That is the reason "constant-time" became a requirement for cryptographic
code rather than a nicety, and the reason OpenSSL's fix was blinding the
input rather than rewriting a comparison.

## Outline

- the legible case: why an early exit leaks, and how small the effect is
  before statistics are applied to it
- the real case: extra reductions and the multiplication-algorithm boundary,
  two data-dependent effects that fight each other
- why a defender who has removed every secret-dependent branch has not
  finished, and what blinding does that constant-time coding does not
