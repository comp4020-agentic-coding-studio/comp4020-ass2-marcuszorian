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
readings:
  - authors: Qian Ge, Yuval Yarom, David Cock and Gernot Heiser
    year: 2018
    title: >-
      A Survey of Microarchitectural Timing Attacks and Countermeasures on
      Contemporary Hardware
    venue: Journal of Cryptographic Engineering 8(1), 1-27
    url: https://doi.org/10.1007/s13389-016-0141-6
  - authors: Francois-Xavier Standaert, Tal G. Malkin and Moti Yung
    year: 2009
    title: >-
      A Unified Framework for the Analysis of Side-Channel Key Recovery
      Attacks
    venue: EUROCRYPT 2009, LNCS 5479, 443-461
    url: https://doi.org/10.1007/978-3-642-01001-9_26
  - authors: Ross Anderson
    year: 2020
    title: >-
      Security Engineering, third edition, chapter 19: Side Channels
    venue: Wiley
    url: https://www.cl.cam.ac.uk/~rja14/book.html
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
- the boundary week 6 drew, restated here as a limit on the method rather than
  on a week: this ranking covers channels that leak what a program did, and is
  silent on transient execution, which leaks what a program only speculated —
  a device exposed to both needs a second analysis this course has not taught,
  and a design review that does not say so has overclaimed its coverage
