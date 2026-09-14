---
title: Timing a decay
description:
  Measuring how fast a keypad forgets what was pressed on it, and finding the
  two different moments at which recovery stops working
week: 8
date: 2027-04-12
teachers:
  - idris-fenn
spec:
  - you can plot per-key residual intensity against time from the supplied
    thermal sequence, and fit a decay to it
  - your plot identifies two windows, not one — the interval in which the set
    of pressed keys is recoverable, and the shorter interval in which their
    order still is
  - you can state, from your own fitted curve, what a keypad would have to
    change materially to make the shorter window close before an attacker
    could arrive
related:
  - assessments/channel-report
---

## Before the Bench

Nothing to record this week. The supplied sequence is a set of thermal frames
of a keypad after a known four-digit entry, timestamped from the moment the
last key was released out to ninety seconds. Bring something that can read
per-pixel intensity out of an image and plot a series — the analysis is
arithmetic, not photography.

## In the Bench

Extract the mean intensity over each key's area in every frame, and plot the
four series against time. Two results come out of that plot, and the second
is the one worth the session.

The first is the obvious one: every series decays, so there is a time after
which no key is distinguishable from the unpressed ones and the set of
pressed keys is gone. Fit a curve and read that time off it.

The second takes more care. The *order* of the keystrokes is not carried by
any single series — it is carried by the differences between them, since the
first key pressed has been cooling longest and is therefore coolest. Those
differences are a fraction of the intensities themselves, and they shrink
faster. Plot the pairwise differences alongside the raw series and find the
time at which the ordering can no longer be read out of them reliably. It
will be substantially earlier than the first time, and that gap is the
week's finding: a defender who knows only "heat fades in about a minute" has
the wrong number for the thing that matters most.

## Afterwards

Keep the fitted decay constant and both windows. Week 10 asks you to put this
channel on a common rubric against the other six, and the constant you fitted
here is the closest thing any Bench so far has produced to the quantitative
claim that rubric wants.

The Channel Report is due this week.
