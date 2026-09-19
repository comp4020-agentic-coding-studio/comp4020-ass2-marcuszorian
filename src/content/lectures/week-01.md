---
title: What a machine says without meaning to
description:
  The opening lecture — stating the course's thesis and the shape of the
  twelve weeks that argue it
week: 1
date: 2027-02-22
claim: >-
  A computation's unintended physical effects are not noise around the
  answer; they are a second output, and this course reads them as one.
channel: none
teachers:
  - marisol-quaye
related:
  - sessions/01-noticing-a-leak
readings:
  - authors: Paul C. Kocher
    year: 1996
    title: >-
      Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and
      Other Systems
    venue: CRYPTO '96, LNCS 1109, 104-113
    url: https://doi.org/10.1007/3-540-68697-5_9
  - authors: Butler W. Lampson
    year: 1973
    title: >-
      A Note on the Confinement Problem
    venue: Communications of the ACM 16(10), 613-615
    url: https://doi.org/10.1145/362375.362389
---

A computation has an intended output and, almost always, a second set of
effects nobody specified: the current a circuit draws while it runs, the heat
it dissipates, the sound its components make, the light its display emits,
the time it takes. None of these is the answer to the question the machine
was asked. All of them can be measured by someone who never touched its
input or its output, and some fraction of the secret the machine was
computing survives in them anyway.

That is the course's whole thesis, and it does not get more sophisticated as
the semester goes on — only more specific. Weeks 2 through 8 take one
physical channel each, state the mechanism that lets information leak through
it, give the historical case that first demonstrated the leak was real and
not theoretical, and ask what it costs a defender to close it. Week 9 steps
back to the precondition every shared-hardware channel depends on, and the
last three weeks turn the accumulated list into a rubric, a defensive
discipline, and a design method a working engineer can use.

The field's founding case is Paul Kocher's 1996 demonstration that the
running time of a naive modular-exponentiation implementation depends on the
secret exponent closely enough to recover it from timing measurements alone —
no fault, no malware, nothing except the time a correct program took to run
its own arithmetic. Every week after this one is a variation on that same
observation, applied to a different physical quantity and argued from a
different disclosure.

Kocher's case is not the field's only founding disclosure, and the other one
draws the boundary this course keeps to. Lampson's 1973 confinement problem
names a *covert* channel: a signalling path two cooperating processes build
on purpose, against a system meant to keep them apart, using a resource
(shared load, file locks, whatever changes state) neither party needs for
its stated job. A side channel, the kind every week after this one measures,
needs no cooperation and no intent — the leak rides on a computation doing
only what it was asked to do, read by an adversary the program never
addressed. Lampson supplies the vocabulary; Kocher supplies the case this
course actually argues from.

## Outline

- the boundary this course draws: a side channel is a physical effect of a
  correct computation, which excludes network intrusion, social engineering
  and every attack that requires the program to be wrong
- why seven channels and not seventy — the selection rule is a documented
  disclosure that changed what defenders were willing to pay for
- what a channel costs to close, as a question asked every week rather than
  a conclusion reached at the end
