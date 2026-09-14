---
title: Tracing by hand
description:
  Reading a captured power trace against the code that produced it, one
  operation at a time
week: 3
date: 2027-03-08
teachers:
  - marisol-quaye
spec:
  - you can mark, on a supplied power trace, where a loop begins and how many
    times it repeats
  - you can point to a visible difference in the trace between two branches
    of an if-statement
  - you can say, for the traced code, which single line the difference comes
    from
---

## Before the Bench

Read the week's deck before arriving — it walks through one trace slowly,
which this session assumes you have already seen once.

## In the Bench

Working from a supplied oscilloscope capture and the short program that
produced it, mark the trace up by hand: where the modular exponentiation's
loop starts, how the trace shape changes on a squaring step versus a
squaring-and-multiply step, and where that shape stops being ambiguous to the
eye. The point is not to break anything — the program is a toy already known
to leak — it is to build the habit of reading current draw as a sequence of
operations rather than as noise.

## Afterwards

Keep your annotated trace. The Trace Analysis Lab supplies a new, unannotated
one from a
different program and asks you to do this again without a lecture walking you
through it first.
