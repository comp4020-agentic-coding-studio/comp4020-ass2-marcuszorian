---
title: Heat that outlasts the keystroke
description:
  Thermal imaging of a keypad after use, and why this channel's clock keeps
  running after the exploit's own action stops
week: 8
date: 2027-04-12
teachers:
  - idris-fenn
related:
  - sessions/08-ranking-the-channels
  - assessments/channel-report
---

A fingertip warms a key it presses, and the key stays measurably warmer than
its neighbours for some time afterwards — long enough, Mowery, Meiklejohn
and Savage's 2011 paper "Heat of the Moment" showed, for a thermal camera
photographing a keypad up to a minute after use to recover the sequence of
keys pressed, ranked by which residual heat is highest. No recording during
the act is needed at all; the channel is entirely retrospective, which
distinguishes it from every channel covered so far.

That retrospective property is this week's point: most of this course's
defences assume a defender who can act while the leak is happening — shield
the room, rewrite the comparison, flush the cache. A thermal residue defeats
that assumption by leaking after the interaction is already over, which is
also why the paper's own recommended defence is procedural (wait before
photographing is irrelevant to the victim; using a keypad material with
faster thermal dissipation is the only lever that helps) rather than
computational.

## Outline

- how long thermal residue on a keypad actually persists, and what that
  implies for a defender's options
- why this channel needed no access during the keystroke itself
- what the Bench's ranking exercise this week is checking for
