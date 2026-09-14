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
readings:
  - authors: Michael Backes, Markus Duermuth and Dominique Unruh
    year: 2008
    title: >-
      Compromising Reflections, or How to Read LCD Monitors Around the
      Corner
    venue: IEEE Symposium on Security and Privacy 2008, 158-169
    url: https://doi.org/10.1109/SP.2008.25
  - authors: Michael Backes, Tongbo Chen, Markus Duermuth, Hendrik P. A.
      Lensch and Martin Welk
    year: 2009
    title: >-
      Tempest in a Teapot: Compromising Reflections Revisited
    venue: IEEE Symposium on Security and Privacy 2009, 315-327
    url: https://doi.org/10.1109/SP.2009.20
  - authors: Joe Loughry and David A. Umphress
    year: 2002
    title: >-
      Information Leakage from Optical Emanations
    venue: ACM TISSEC 5(3), 262-289
    url: https://doi.org/10.1145/545186.545189
---

A display's light does not stop at the edge of the screen: it reflects off
whatever is in the room, including surfaces nobody would think to call
reflective. Backes, Dürmuth and Unruh's 2008 paper "Compromising Reflections"
recovered readable text from a telescope trained on a monitor's reflection in
a teapot, a pair of eyeglasses, a spoon and a plastic bottle. The cornea is
the result people remember, and it is not in that paper: the 2009 follow-up,
"Tempest in a Teapot", added the reflection in the user's own eye, along with
diffuse reflections from a wall or a shirt and computational deconvolution to
recover detail the reflecting surface's curvature had smeared.

The two papers are worth reading in order, because the second is what turns
the first from a demonstration into a measured claim: it reports the
information-theoretic limit on what a diffuse reflection can carry, which is
the difference between "this worked once" and "here is how far it goes."

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
