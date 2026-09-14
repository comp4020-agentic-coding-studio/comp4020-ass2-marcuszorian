---
title: Closing a channel in software
description:
  Constant-time programming as a discipline, and what it costs to actually
  practise it
week: 11
date: 2027-05-03
claim: >-
  Detecting a leak and closing one are different skills, and a rewrite that
  only makes a channel harder to see is not a fix.
channel: none
teachers:
  - idris-fenn
related:
  - sessions/11-rewriting-for-constant-time
---

Closing a timing channel is not the same task as detecting one. Daniel
Bernstein's 2005 report "Cache-timing attacks on AES" demonstrated that even
implementations believed constant-time could still leak through
data-dependent cache access patterns — a table lookup indexed by secret data
takes a different amount of time depending on whether that index was
recently cached — which meant "avoid secret-dependent branches" was
necessary but not sufficient, and pushed the field toward implementations
that also avoid secret-dependent memory addresses.

The discipline that followed is unglamorous by design: no early returns on
secret-dependent conditions, no array indexing by secret values without
deliberate flattening, no compiler optimisation trusted to preserve either
property without being told to. Constant-time code is frequently slower on
average and always harder to read than the version it replaces, which is the
same trade this week's Bench asks you to make and then name honestly, rather
than presenting a rewrite as a strict improvement.

## Outline

- the three rules in order of how often they are missed: no secret-dependent
  branch, no secret-dependent memory address, no compiler left free to
  reintroduce either
- blinding as the countermeasure for the case constant-time coding cannot
  reach — week 4's extra reductions and week 3's power correlation are both
  closed by randomising the input, not by restructuring the control flow
- verification, not inspection: why reading the rewritten code proves nothing
  and what measurement, reusing week 4's harness, is required instead
