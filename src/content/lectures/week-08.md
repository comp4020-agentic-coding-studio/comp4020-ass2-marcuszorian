---
title: Heat that outlasts the keystroke
description:
  Thermal imaging of a keypad after use, and why this channel's clock keeps
  running after the exploit's own action stops
week: 8
date: 2027-04-12
claim: >-
  A channel can outlive the computation that produced it, which defeats
  every defence assuming a defender present while the leak happens.
channel: thermal
teachers:
  - idris-fenn
related:
  - sessions/08-timing-a-decay
  - assessments/channel-report
readings:
  - authors: Julien Brouchier, Tom Kean, Carol Marsh and David Naccache
    year: 2009
    title: >-
      Temperature Attacks
    venue: IEEE Security & Privacy 7(2), 79-82
    url: https://doi.org/10.1109/MSP.2009.54
  - authors: Keaton Mowery, Sarah Meiklejohn and Stefan Savage
    year: 2011
    title: >-
      Heat of the Moment: Characterizing the Efficacy of Thermal
      Camera-Based Attacks
    venue: USENIX WOOT 2011
    url: https://www.usenix.org/conference/woot11/heat-moment-characterizing-efficacy-thermal-camera-based-attacks
  - authors: Ramya Jayaram Masti, Devendra Rai, Aanjhan Ranganathan,
      Christian Mueller, Lothar Thiele and Srdjan Capkun
    year: 2015
    title: >-
      Thermal Covert Channels on Multi-core Platforms
    venue: USENIX Security 2015, 865-880
    url: https://www.usenix.org/conference/usenixsecurity15/technical-sessions/presentation/masti
---

A fingertip warms a key it presses, and the key stays measurably warmer than
its neighbours for some time afterwards — long enough, Mowery, Meiklejohn
and Savage's 2011 paper "Heat of the Moment" showed, for a thermal camera
photographing a keypad up to a minute after use to recover the sequence of
keys pressed, ranked by which residual heat is highest. No recording during
the act is needed at all; the channel is entirely retrospective, which
distinguishes it from every channel covered so far.

That retrospective property is this week's point, and it has a consequence
every other week of this course avoided. Every defence so far assumes a
defender who can act while the leak is happening: shield the room before the
monitor is switched on, rewrite the comparison before it runs, disable page
deduplication before the tenant arrives. A thermal residue leaks after the
interaction is over and after the attacker's own presence would have been
noticed, so there is no moment at which the defender could have intervened
and no observation the defender could have made.

What is left is a defence chosen at purchase rather than at runtime.
Residual heat decays at a rate set by the keypad's material and mass, not by
anything the software does: the paper's own measurements separate plastic
keypads, which hold a usable signal for tens of seconds, from brushed metal,
which dissipates fast enough that recovery fails almost immediately. The
channel is closed by specifying a different keypad, and by nothing else —
which is worth naming precisely, because it is the clearest case in the
course of a leak whose only lever sits with whoever signed the procurement
order.

The decay also degrades unevenly, which is the detail this week's Bench
measures. Which keys were pressed survives longer than the order they were
pressed in, because the ordering is carried by the differences between
residues rather than by their presence, and those differences shrink first.

## Outline

- how residual heat decays, and why the *order* of the keystrokes is lost
  before the *set* of them is
- the structural consequence of a channel with no defender present: no
  detection, no interruption, no incident to respond to
- a mitigation with no software component at all, and what that implies for
  where this channel should be raised — design review, not code review
