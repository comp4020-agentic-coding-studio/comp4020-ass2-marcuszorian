---
title: Acoustic emanations
description:
  What a keyboard's sound reveals about what was typed on it, and how far
  the effect generalises
week: 2
date: 2027-03-01
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

- what makes one key's sound distinguishable from another's
- why a language model, not just a better microphone, is what made the
  attack practical
- what a keyboard would have to do differently to close this channel, and
  why almost none do
