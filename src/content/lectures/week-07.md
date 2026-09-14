---
title: Compromising reflections
description:
  Recovering a screen's contents from its reflection in glasses, a teapot,
  or an eyeball, at a distance and after the fact
week: 7
date: 2027-04-05
claim: >-
  A surface nobody designed to be a display can be one, which makes this
  channel a property of the room rather than of the device.
channel: optical
teachers:
  - idris-fenn
related:
  - sessions/07-measuring-a-reflection
---

A display's light does not stop at the edge of the screen: it reflects off
whatever is in the room, including surfaces nobody would think to call
reflective. Backes, Chen, Duermuth, Lensch and Welk's 2008 paper
"Compromising Reflections" reconstructed readable text from photographs of a
monitor's reflection in a user's eyeglasses, a teapot, and the user's own
cornea, using off-the-shelf cameras and computational deconvolution to
recover detail the reflecting surface's curvature had smeared.

The result matters less for any particular surface than for the general
claim it establishes: a channel does not need to be intentional or even
electronic to count. Light bouncing off an incidental object is exactly as
much a side channel as a chip's current draw, and the same question this
course keeps asking — what would it cost to close this? — has a genuinely
different answer here, since the "leak" is a property of geometry and
optics that no software patch touches.

## Outline

- specular against diffuse: why a curved teapot is a usable optic and a matte
  wall is not, and why the curvature costs resolution rather than preventing
  recovery
- deconvolution as the step that turns an unreadable photograph into a
  readable one, and the point at which no amount of processing recovers
  information the surface never carried
- a defence that belongs to no vendor: this is the one channel in the course
  closed by moving furniture, and the only one whose mitigation appears in
  building standards rather than in an errata sheet
