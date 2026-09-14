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
readings:
  - authors: Dmitri Asonov and Rakesh Agrawal
    year: 2004
    title: >-
      Keyboard Acoustic Emanations
    venue: IEEE Symposium on Security and Privacy 2004, 3-11
    url: https://doi.org/10.1109/SECPRI.2004.1301311
  - authors: Li Zhuang, Feng Zhou and J. D. Tygar
    year: 2005
    title: >-
      Keyboard Acoustic Emanations Revisited
    venue: ACM CCS 2005, 373-382
    url: https://doi.org/10.1145/1102120.1102169
  - authors: Daniel Genkin, Adi Shamir and Eran Tromer
    year: 2014
    title: >-
      RSA Key Extraction via Low-Bandwidth Acoustic Cryptanalysis
    venue: CRYPTO 2014, LNCS 8616, 444-461
    url: https://doi.org/10.1007/978-3-662-44371-2_25
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

The generalisation that matters, though, is not to another keyboard. Genkin,
Shamir and Tromer's 2014 paper "RSA Key Extraction via Low-Bandwidth Acoustic
Cryptanalysis" recorded the machine rather than the thing typed on it: the
capacitors and coils in a laptop's voltage regulator vibrate as the
processor's load changes, and the resulting noise sits under 20 kHz — within
range of a plain mobile phone placed beside the computer, or a more sensitive
microphone four metres away. Different decryption keys produced measurably
different acoustic signatures, enough to recover a full 4096-bit RSA key in
about an hour. That upper limit is roughly five orders of magnitude below the
clock driving the computation, which is the point rather than a caveat: the
channel does not observe operations, it observes the envelope of very many of
them, and the key falls out of the aggregate.

The defensive cost is the instructive part, because nobody shielded anything.
The response shipped in GnuPG 1.4.16, alongside the disclosure, was
exponentiation blinding — randomising the intermediate values so that a
chosen ciphertext no longer produces a predictable profile to measure. An
acoustic emanation from a power supply was closed by a change to arithmetic,
which is week 11's argument arriving nine weeks early.

## Outline

- what makes one key's sound distinguishable from another's, in mechanical
  terms: strike position, plate resonance, and the distance to the recorder
- why the decisive improvement came from the language being typed rather
  than from the microphone — the point at which this stopped being a
  signal-processing result
- the channel's own limits: what a second, unseen keyboard does to a trained
  classifier, and why that limit is smaller than it sounds
- the same channel with no keyboard in it: acoustic emanation from a laptop's
  own power supply, what a sub-20 kHz ceiling forces the analysis to do
  instead of reading operations, and why the fix was arithmetic rather than
  soundproofing
