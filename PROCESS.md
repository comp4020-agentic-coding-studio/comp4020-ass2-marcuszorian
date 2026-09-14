# Process overview

## What I built

SLOP4979, *Side Channels: What Machines Say Without Meaning To* — a
twelve-week, image-free course teaching acoustic, power, timing,
electromagnetic, cache, optical and thermal side channels as one compounding
argument: a computer leaks information through channels nobody designed in,
and the semester asks what noticing each one is worth. Three assessments
(30/30/40) build from reading a single trace, to a full channel report, to a
capstone design review that applies the whole taxonomy to one device.

## How I got here

The harness and brief came first: the starter arrived fixed, and the
course-code commit [`b4cc573`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/b4cc573)
fixed the code before any content existed. Before writing anything I ran
`pnpm check` and found it already red —
[`29ff4c5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/29ff4c5)'s
own spec test asserted twelve dated sessions, weeks 1-12, and only two
session files existed. That failure became the plan's anchor rather than
something to route around: every step after it was scoped so the repo never
stayed red longer than it took to reach the next green state.

Choosing the course concept was adversarial rather than first-idea: I
evaluated several candidates against the brief's own three criteria before
the user asked directly, "which of those 3 would you say is strongest, and
would allow me to achieve the highest grades." Side channels won because its
twelve weeks compound into one thesis instead of listing independent topics,
and because that structure is mechanically checkable — cross-linking,
week-span, weight-sum — in a way a looser topic is not.
[`eb10325`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/eb10325)
records that decision in CLAUDE.md, alongside the deadpan-register rule and
the image-free choice: rather than commission stand-in art for four deleted
starter images, the course drops imagery entirely, which
`scripts/check-evidence.ts`'s own comments call a legitimate design decision,
and which also suits a course about what a machine reveals without meaning
to.

[`f85da51`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/f85da51)
is the content commit: identity, copy, both staff bios, all twelve lectures
and Benches, three real assessments, two decks, and real policy content,
landing in one commit specifically so the repo moved from red to green in a
single step rather than staying red across a config commit and a separate
content commit. It also extended the existing sessions-span-twelve-weeks
test to lectures, so the same contract now holds both collections.

[`70b1408`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/70b1408)
is a harness-only follow-up, kept separate from content per this repo's own
CLAUDE.md rule that harness changes get their own commit: a cross-linking
test confirming every week's lecture and Bench reference each other and that
every assessment links back to a session, and a voice-lint scanning all
content for the banned marketing phrases and exclamation points the register
rule already names in prose, so a later pass over the content cannot
reintroduce them unnoticed.

The suite now runs 92 tests across four spec files, alongside the build's own
accessibility, internal-link, and deck-compilation checks — all green,
verified with `pnpm check` before each commit rather than after.
