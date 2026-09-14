# Your harness

Nothing about the starter is recorded here. The platform under you is fixed and
documented in `README.md`, and the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or build;
what the agent needs to carry from either is your call.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open pages in a browser and look at them, at both marking viewports. Markers
  read this site the way a prospective student would, across a dozen pages ---
  a check that passes on parsed HTML says nothing about whether the pages hang
  together as a course.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## Test the contract, not the implementation

A test that hardcodes a specific piece of content or wording breaks the moment
you rewrite that page, and a suite you've learned to ignore is worse than no
suite. Assert what must stay true regardless of exact wording --- a page exists
and links from the nav, an assessment's weights sum to 100, a lecture links a
real deck --- so the tests survive further passes over the content.

## CI runs nothing while the repo is private

Both jobs in `.github/workflows/checks.yml` are gated on
`!github.event.repository.private`, so between the first commit and the
visibility flip at ship time, **every push is unobserved**. Nothing is broken;
it is deliberate, and it means local `pnpm check` and `pnpm check:evidence` are
the only backpressure that exists for the whole build.

The consequence to plan around: the first public push is the first time the
link checker, the secret scan and the evidence gate have ever run against this
repo --- and that push happens at the cutoff, when there is no time left to fix
what they find. Run both locally, early, and don't let the flip be the first
time they're exercised.

## This file is yours

A starting point, not a rulebook: what you add to it is the harness, and the
harness is assessed. Carried forward from comp4020-crit5 (A game), trimmed to
the rules that generalize --- the canvas/WebAudio/screenshot-sensor rules from
that repo's game template didn't carry, since nothing here matches them.

## The course: SLOP1979, Side Channels

"Side Channels: What Machines Say Without Meaning To." The thesis, restated on
every page that needs it: a computer leaks information through channels nobody
designed in --- sound, current, heat, timing, light --- and this course studies
each channel on its own terms, then asks what noticing it is worth. Every week
must argue that thesis again in its own material, not just add another
encyclopedia entry to a list; if a week could be deleted without the argument
weakening, it's the wrong week.

- **Register**: deadpan and precise, in the voice of hard-science measurement
  writing, not "hacker" voice and not a wink at the reader. Say what a channel
  is, how it's measured, what it costs to close --- never "unlock," "dive
  into," "game-changer," or an exclamation point. The domain's own jargon
  (differential power analysis, constant-time, mutual information) already
  carries the voice; don't decorate it.
- **Every week states an activity**, not just content: the session/Bench page
  says what a student does that week (reads a trace, sketches a threat model,
  rewrites a branch), not only what they read about.
- **Content only** --- no operational attack code or step-by-step exploitation
  instructions. Every channel is taught at the level of "here is the
  mechanism and the historical disclosure that established it," never "here is
  how you'd build one." That's also just what the material calls for: a
  history-and-measurement course, not a tool.
- **Image-free, deliberately**: this repo ships with no photography or
  illustration. `pnpm check:evidence` requires every starter image be
  replaced or removed; rather than commission stand-in art, the course drops
  imagery entirely, which also fits a course about what a machine reveals
  without meaning to --- there's nothing here to look at, only to measure.
  Don't reintroduce a hero image or portraits without updating this rule.
- **Sessions are labelled "Bench"** (`sessionLabels` in `site-config.ts`) ---
  the weekly hands-on measurement session, distinct from the lecture.

## The argument chain: every week says what it changes

Twelve weeks is twelve topics unless each one names what it does to the
thesis. So every lecture carries a `claim:` --- one sentence, in the register
above, saying what this week changes about the argument, not what it covers
--- and no two weeks may claim the same change. The twelve claims render in
order on `/lectures/`, which is where a marker reads the course as one
argument rather than a grid of cards. A week you cannot write a distinct
claim for is the week the course thesis says to delete.

Each lecture also declares a `channel:`: one of the seven measured channels,
or `none` for the weeks that do something to the accumulated list rather than
extend it (week 1, week 9's precondition, and the three closing weeks). A
channel is introduced in exactly one week.

## Counts are derived, not typed

**Never hand-write how many channels or axes the course has.** The number of
channels is `channel:` frontmatter; the taxonomy is `axes:` data on the week
that introduces it. Prose may state a total, but `spec/argument-chain.test.ts`
checks every total against the data and fails on disagreement --- because it
already went wrong once, silently, in four places at once: the week-10 lecture
said six while enumerating six and dropping timing, its deck agreed with the
wrong number, the week-8 Bench said six while listing seven Benches of notes,
and the home page said twelve.

The test reads a count as a *total* when it follows "the" or "all" or opens a
line, so partitive prose ("four of them you can fill in from your notes")
stays legal. Add a channel or an axis and the failures tell you every page
that now lies.

## Harness changes are their own commits

A new rule in this file, or a new script in `spec/`, is committed on its own,
separate from the content change it protects --- so `PROCESS.md` can cite the
harness decision and the content it produced as two separate, legible facts.

## Link and focus styling

No default browser blue box or heavy outline around text links. Keyboard
focus must still be clearly visible (a visible `:focus-visible` treatment,
never `outline: none` with nothing replacing it) --- check both link states in
a real browser, at both marking viewports, not just via axe.
