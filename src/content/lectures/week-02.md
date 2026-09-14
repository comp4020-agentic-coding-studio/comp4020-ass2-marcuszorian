---
title: Acoustic emanations
description:
  What a keyboard's sound reveals about what was typed on it, and how far
  the effect generalises
week: 2
date: 2027-03-01
claim: >-
  A channel needs no contact and no electronics: a microphone in the room is
  enough, once a language model supplies what the signal alone cannot.
channel: acoustic
teachers:
  - idris-fenn
related:
  - sessions/02-listening-for-keys
---

Every key on a mechanical or membrane keyboard produces a slightly different
sound, because it strikes at a slightly different position and with a
slightly different mechanism. Asonov and Agrawal's 2004 paper "Keyboard
Acoustic Emanations" showed that a simple recording of typing, fed through
neural-network classification trained on that same keyboard, recovers a
majority of keystrokes correctly — no bug in the keyboard, no malware on the
machine, only a sound the room was always making.

The result generalises further than a single keyboard: later work extended
it to recordings made over VoIP calls and to keyboards the classifier had
never heard before, trained instead on the statistical regularities of the
language being typed. The mechanism is acoustic and mechanical; the leak it
produces is closer to a language-modelling problem than a signal-processing
one, which is why the channel stays open even against keyboards designed to
sound quieter.

## Outline

- what makes one key's sound distinguishable from another's, in mechanical
  terms: strike position, plate resonance, and the distance to the recorder
- why the decisive improvement came from the language being typed rather
  than from the microphone — the point at which this stopped being a
  signal-processing result
- the channel's own limits: what a second, unseen keyboard does to a trained
  classifier, and why that limit is smaller than it sounds
