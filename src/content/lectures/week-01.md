---
title: What a machine says without meaning to
description:
  The opening lecture — stating the course's thesis and the shape of the
  twelve weeks that argue it
week: 1
date: 2027-02-22
teachers:
  - marisol-quaye
related:
  - sessions/01-noticing-a-leak
---

A computation has an intended output and, almost always, a second set of
effects nobody specified: the current a circuit draws while it runs, the heat
it dissipates, the sound its components make, the light its display emits,
the time it takes. None of these is the answer to the question the machine
was asked. All of them can be measured by someone who never touched its
input or its output, and some fraction of the secret the machine was
computing survives in them anyway.

That is the course's whole thesis, and it does not get more sophisticated as
the semester goes on — only more specific. Each week takes one physical
channel, states the mechanism that lets information leak through it, gives
the historical case that first demonstrated the leak was real and not
theoretical, and asks what it costs a defender to close it. The last two
weeks turn the list into a rubric a designer can actually use.

The field's founding case is Paul Kocher's 1996 demonstration that the
running time of a naive modular-exponentiation implementation depends on the
secret exponent closely enough to recover it from timing measurements alone —
no fault, no malware, nothing except the time a correct program took to run
its own arithmetic. Everything after week 4 is a variation on that same
observation applied to a different physical quantity.

## Outline

- what "side channel" means, and what it does not (this is not a course
  about network intrusion or social engineering)
- the shape of the semester: one channel a week, each argued from mechanism
  to disclosure to defensive cost
- what week 1's Bench asks you to do before any of that starts
