---
title: The leakage taxonomy
description:
  Putting one rubric under seven individually-argued channels, and attaching
  a number to what each of them actually reveals
week: 10
date: 2027-04-26
claim: >-
  "It leaks" is not a finding until it is a number; mutual information makes
  seven channels argued on their own terms comparable on one.
channel: none
axes:
  - name: Medium
    question: which physical quantity carries the information out of the device
  - name: Proximity
    question: how close the attacker has to get, and for how long
  - name: Availability
    question: whether the leak can be collected during the computation or only afterwards
  - name: Rate
    question: how many bits of the secret one measurement carries, on average
  - name: Volume
    question: how many measurements are needed before the estimate is usable
  - name: Cost to close
    question: what a defender gives up to remove the channel, in money, throughput or function
teachers:
  - idris-fenn
slides: /decks/week-10/
related:
  - sessions/10-scoring-a-leak
---

Weeks 2 through 8 each argued one channel on its own terms, and were built
so that no two of those arguments were the same shape. The cost of that
choice is that nothing so far has let you say whether the acoustic channel is
a worse problem than the thermal one, or whether either is worth attending to
before the cache. This lecture supplies the missing rubric: the six axes
below, applied to all seven channels at once.

Four of the axes are descriptive and you have the answers already from your
own Bench notes. Two are not. *Rate* and *volume* — how much one measurement
tells you, and how many you need — have been treated informally since week 3,
where "average enough traces" stood in for a quantity nobody put a number on.
Mutual information is that number:

`I(S; M) = H(S) − H(S | M)`

the reduction in uncertainty about a secret `S` produced by observing a
measurement `M` of it. Zero means the measurement told you nothing. `H(S)`
means it told you everything. Everything this course has called a leak sits
somewhere strictly between, and where it sits is the difference between a
channel that needs one trace and one that needs ten million — a distinction
that decides whether an attack is a paper or a product.

The taxonomy is not a classification exercise, and this is the lecture's
actual argument. Ordering the seven channels by what it costs an attacker to
use them produces one list; ordering them by what it costs a defender to
close them produces a different list, and the two disagree more than they
agree. A channel that is cheap to exploit and cheap to close is a bug, and
gets fixed. A channel that is expensive to exploit and expensive to close is
somebody else's threat model. The channels that matter are the ones where the
two orderings diverge — cheap to exploit, expensive to close — and the only
way to find them is to build both orderings and compare them, which is what
this week's Bench does with your own measurements rather than with supplied
examples.

## Outline

- the six axes, and which four you can already fill in from your Bench notes
- mutual information as an estimator: what it needs, what it assumes, and
  how badly it behaves on too few samples
- building the two orderings — attacker cost and defender cost — and reading
  the disagreement between them as a prioritisation
- why the capstone asks for a number and not an adjective
