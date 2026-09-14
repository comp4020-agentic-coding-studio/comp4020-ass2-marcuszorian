---
title: Trace Analysis Lab
description:
  Reading an unannotated power trace against the program that produced it,
  without a lecture walking you through it first
week: 4
due: 2027-03-19T12:00:00+10:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Accuracy of the trace reading
      weight: 60
    - name: Clarity of the reported method
      weight: 40
spec:
  - submitted by the deadline, as a short written report plus your annotated
    trace image
  - the report correctly identifies where in the trace the secret-dependent
    operation occurs
  - the report states how you would confirm the finding on a second,
    independent trace
related:
  - sessions/03-tracing-by-hand
---

## The brief

> You are given one power trace and the source of the program that produced
> it. Say which operation the secret controls, and where in the trace that
> control is visible.

Week 3 walked through one trace as a class, slowly, with the algorithm
alongside it. This lab supplies a different program — still simple, still a
single secret-dependent branch somewhere in its execution — and asks you to
do the same reading alone. The trace will not be as clean as the deck's; part
of what is being assessed is whether you can still make the call under real
noise, not just under the deck's tidied example.

## What you submit

An annotated image of the trace (the same style of annotation practised in
the Bench) and a short written report: what operation you believe is
secret-dependent, where in the trace you can point to that dependence, and
one sentence on how you would check the finding against a second trace from
the same program. No exploit code or working key-recovery script is
required or wanted — the deliverable is the reading, not a tool.
