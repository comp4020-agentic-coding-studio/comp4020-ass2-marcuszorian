---
title: Radiation nobody asked for
description:
  Van Eck phreaking, TEMPEST, and what it costs to stop a display's own
  electronics from broadcasting what it shows
week: 5
date: 2027-03-22
claim: >-
  Closing a channel is an engineering cost with a shape, and that shape —
  not the mechanism — decides who ever pays it.
channel: electromagnetic
teachers:
  - marisol-quaye
related:
  - sessions/05-shielding-a-room
---

Every video display, from a cathode-ray tube to a modern digital interface,
drives its image with electrical signals that change in step with the
picture, and those signals radiate. Wim van Eck's 1985 paper "Electromagnetic
Radiation from Video Display Units: an Eavesdropping Risk?" demonstrated that
an ordinary television, retuned, could reconstruct a readable image of a
target monitor's screen from a distance, using equipment inexpensive enough
that the paper's main claim was less "this is possible" than "this is
already affordable."

The channel gave its name to a class of countermeasures — TEMPEST shielding —
that predates van Eck's public paper by decades in classified government use,
which is itself informative: the defensive cost of closing an electromagnetic
channel was judged worth paying by intelligence agencies long before the
attack was public knowledge, and the same shielding remains largely confined
to government and military settings today because the cost curve this week's
Bench prices out never became consumer-affordable.

## Outline

- why a raster's emissions are reconstructible rather than merely detectable:
  the signal repeats on a known schedule, so a receiver can average it out of
  the noise floor
- attenuation as a cost curve, not a price: each additional 10 dB costs more
  than the last, because the remaining leakage moves from the walls to the
  seams, the ventilation and the mains
- who pays that curve to its end, and what it means that the same disclosure
  was classified for decades before it was published
