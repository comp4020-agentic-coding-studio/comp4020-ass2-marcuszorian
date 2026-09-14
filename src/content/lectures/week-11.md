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
slides: /decks/week-11/
teachers:
  - idris-fenn
related:
  - sessions/11-rewriting-for-constant-time
readings:
  - authors: Daniel J. Bernstein
    year: 2005
    title: >-
      Cache-timing attacks on AES
    venue: Technical report, University of Illinois at Chicago
    url: https://cr.yp.to/antiforgery/cachetiming-20050414.pdf
  - authors: Jose Bacelar Almeida, Manuel Barbosa, Gilles Barthe, Francois
      Dupressoir and Michael Emmi
    year: 2016
    title: >-
      Verifying Constant-Time Implementations
    venue: USENIX Security 2016, 53-70
    url: https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/almeida
  - authors: Jean-Sebastien Coron
    year: 1999
    title: >-
      Resistance Against Differential Power Analysis for Elliptic Curve
      Cryptosystems
    venue: CHES 1999, LNCS 1717, 292-302
    url: https://doi.org/10.1007/3-540-48059-5_25
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

Some leaks are not reachable by restructuring code at all. Where the secret is
an exponent or a scalar rather than a branch condition, the operation's
duration and its power profile depend on that secret however the loop is
written, and the countermeasure is to randomise the input instead. Coron's
1999 paper on elliptic-curve implementations set out the three blindings still
in use — randomise the scalar by adding a multiple of the group order,
randomise the base point, randomise the projective representation — each of
which leaves the result unchanged and makes the measured trace different every
time. Blinding is the software counterpart of week 3's masking, and it is
priced differently: it costs arithmetic and a source of randomness rather than
readability, and unlike a constant-time rewrite it can be applied to an
implementation whose control flow you are not willing to touch. It is also the
answer to week 4's extra reductions, which is why a rewrite that only reorders
branches does not close them.

## Outline

- the three rules in order of how often they are missed: no secret-dependent
  branch, no secret-dependent memory address, no compiler left free to
  reintroduce either
- blinding as the countermeasure for the case constant-time coding cannot
  reach — week 4's extra reductions and week 3's power correlation are both
  closed by randomising the input, not by restructuring the control flow
- verification, not inspection: why reading the rewritten code proves nothing
  and what measurement, reusing week 4's harness, is required instead
