---
title: Choosing which channels to defend
description:
  The closing lecture — turning a semester of separately-argued channels into
  one design method with a stated stopping point
week: 12
date: 2027-05-10
claim: >-
  No defender closes every channel, so the semester's output is a method for
  deciding which ones a stated device and adversary make worth closing.
channel: none
slides: /decks/week-12/
teachers:
  - marisol-quaye
related:
  - sessions/12-defending-a-design
  - assessments/capstone-design-review
---

No device is threatened by every channel this course has covered, and no
defender has the budget to close every channel a device is theoretically
exposed to. The semester's last argument is that this is a design problem
with a method, not a list to be worked through in order: state the device,
state the adversary's proximity and resources, use week 10's taxonomy to
rule out channels the adversary cannot reach or cannot afford, and rank what
remains by the mutual-information estimate that quantifies how much each one
actually reveals.

That method is exactly what the capstone design review asks a student to
apply once, in full, to a device and adversary of their own choosing — the
same six moves this lecture just walked through, run without a lecture
supplying the answer. A course that spent twelve weeks establishing that
channels are real ends by insisting that "real" is not the same question as
"worth defending against, here, for this device" — the second question is
the one an engineer is actually paid to answer.

## Outline

- the method, as six moves: state the device, state the adversary's
  proximity and budget, rule out the channels that adversary cannot reach,
  rank what survives by rate against cost to close, name what you are
  choosing not to defend, and say what would change your mind
- the two failure modes in practice — an adversary stated so loosely that
  every channel applies, and a ranking with no residual risk admitted
- where the method stops: week 9's placement defence, and the fact that the
  cheapest move is often not on the channel list at all
