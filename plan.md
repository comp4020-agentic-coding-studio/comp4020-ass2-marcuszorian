# Plan: decks and lecture verification for SLOP1979

Working document, not a deliverable. Scope: the twelve weekly lectures, the
slide decks, and the harness that keeps both honest. Everything below is
measured against the Assignment 2 brief and the HD band descriptors, not
against "is there enough content."

Starting state, verified 2026-09-14: `pnpm check` green — 38 pages, 92 tests
across 4 spec files, axe clean, no broken links, 2 decks compile. Nothing in
this plan is a fix for a red state; it is all a fix for content that passes
every mechanical check and still would not earn an HD.

---

## 1. What the rubric actually rewards here

From the brief and the assessment page, the parts that bear on lectures and
decks:

| Criterion | Weight | What HD requires |
|---|---|---|
| Legibility of process | 45% | failures diagnosed **at the harness level**, judgement visible in discarded work, and an account of why a call beat the alternative and how it was verified |
| Working deployed artefact | 20% | holds up under keyboard, resize mid-interaction, slow connection |
| Response to the brief | 35% | "a pointed, surprising answer... one idea, carried all the way"; repetitive weeks or a starter with nouns swapped damages this |

Spec floor already met: twelve dated weeks, one lecture carrying a real deck,
weights summing to 100. The floor is not the band. Two consequences drive
this plan:

- **Corroboration is the floor of the process band, not its ceiling.** A
  defect found by reading and fixed by editing scores nothing. The same
  defect found, then *prevented by a check*, is the HD evidence. So every
  finding in §2 gets paired with a harness rule or a spec test in §5 — not
  just a corrected sentence.
- **Markers read ~10 minutes, several non-adjacent weeks.** They will not
  read all twelve. They will read week 1, something mid-semester, week 12,
  an assessment, and the deck. Depth has to be visible in *any* three weeks
  picked at random, not distributed evenly and thinly across all of them.

---

## 2. Findings from the verification pass

Three of these are factual errors about the published literature. In a course
whose register is "hard-science measurement writing," a marker who knows the
field reading a wrong mechanism does more damage than a missing deck.

### A. Technical accuracy defects (must fix)

**A1 — `week-04.md` misstates Brumley & Boneh 2003.** The lecture says the
attack recovered "an RSA private key used only inside the comparison," framing
the paper as a remote early-exit `memcmp`. It is not. The paper attacks
OpenSSL's RSA-CRT decryption through two competing timing effects: the number
of *extra reductions* in Montgomery multiplication, and OpenSSL's switch
between Karatsuba and normal multiplication. There is no secret comparison
anywhere in it. The fix is not to delete the early-exit material — that is
good, teachable, and true of HMAC/token comparison — but to stop attributing
it to this paper. The week should carry **two mechanisms**: the early-exit
comparison (local, intuitive, what the Bench measures) and Montgomery extra
reductions (remote, statistical, what the paper actually did), with the
lecture's argument being that the second is what made "constant-time" a
requirement rather than a nicety. That is a depth increase, not just a
correction.
Source: <http://crypto.stanford.edu/~dabo/papers/ssl-timing.pdf>

**A2 — `week-06.md` misstates FLUSH+RELOAD's preconditions.** The lecture
claims the technique recovers a key "from a process sharing nothing with the
victim but a CPU." FLUSH+RELOAD *requires shared memory pages* — shared
libraries or content-based page deduplication — because `clflush` must act on
a line the attacker can address. The no-sharing technique is PRIME+PROBE.
Conversely, the week-10 deck's taxonomy table lists cache as requiring a
"shared core," which is the opposite error: targeting the L3 is precisely
what let Yarom & Falkner drop the same-core requirement. Both the lecture and
the deck row are wrong, in opposite directions, about the same paper.
Fix: state the sharing requirement explicitly, name PRIME+PROBE as the
fallback when dedup is disabled, and correct the deck to "shared LLC, any
core." Naming the two variants and what each costs the attacker is exactly
the mechanism-level depth the course claims to teach.
Source: <https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-yarom.pdf>

**A3 — `week-09.md` is anachronistic about its own mechanism.** It says
Ristenpart et al. (2009) used "exactly the kind of cache-contention signal
week 6 introduced" — but week 6's FLUSH+RELOAD is 2014, five years later, and
Ristenpart's extraction used same-core L1 contention, a different primitive.
Fix by reversing the dependency: week 9's contribution is *placement* (how you
discover you share hardware at all), and its extraction step is the weaker,
earlier, same-core signal that week 6 later superseded. That ordering is more
interesting than the current one and it is true.

**A4 — `week-07.md` attribution drift.** The cornea result is weak in the 2008
"Compromising Reflections" paper and strong in the 2009 follow-up ("Tempest in
a Teapot"). Minor; cite both or drop the cornea claim from the 2008 sentence.

### B. Internal inconsistencies and dangling promises

**B1 — `sessions/06-mapping-a-shared-cache.md` says "the deck's outline names
where to find both." Week 6 has no deck.** A student following that
instruction hits nothing. Confirmed by grep.

**B2 — `sessions/09-sharing-a-tenant.md` says "Read the placement-checking
section of the week's readings."** There are no readings anywhere in the
repo — no reading list page, no `readings:` frontmatter, nothing. Every
primary source in this course exists only as an unlinked name inside a
paragraph.

**B3 — "Assignment 1" is named in four places** (`week-03.md`, `week-04.md`,
`sessions/03`, `sessions/04`, `decks/week-03`) and no assessment is called
that. The assessment is "Trace Analysis Lab." A student cross-referencing the
assessment page finds no Assignment 1.

**B4 — the channel count does not add up.** `week-10.md` says "six axes" and
lists five. It says "six weeks of individually distinct channels" and
enumerates acoustic, electrical, electromagnetic, cache, optical, thermal —
silently dropping timing, which is week 4 and is plainly a channel.
`sessions/08` then says "rank all six channels covered so far" while listing
seven Benches' worth of notes to bring. The deck's table lists six axes,
including one the lecture omits. Nothing in the repo agrees on how many
channels this course teaches.

**B5 — `channel-report.md` is due 2027-04-16 but scopes itself "weeks 2
through 9."** Week 9's lecture is 2027-04-19. The assessment asks students to
choose from material taught after it is due.

### C. Unnecessary and redundant content

**C1 — Week 8's Bench duplicates week 10's Bench.** `08-ranking-the-channels`
scores channels on three axes; `10-scoring-a-leak` scores channels on the
taxonomy's axes with a number attached. Week 8's own text admits "none of this
week's material is new measurement." Meanwhile week 8's *lecture* is thermal
residue — a channel with a decay curve, a time constant, and a defence that is
materials science — and its Bench does no thermal measurement at all. This
breaks CLAUDE.md's own rule that every week states an activity, and it is the
clearest case of a component that could be deleted without weakening the
argument.
**Fix:** week 8's Bench becomes a thermal measurement — residue against time,
plotted, with the key-order recovery window read off the curve — and the
comparative ranking consolidates into week 10 where the taxonomy actually
lives. This removes the redundancy, fixes B4's counting problem at its source,
and gives week 8 a real activity and a real deck subject.

**C2 — The three-bullet Outline is identical in shape across all twelve
weeks**: mechanism, history, defensive cost, plus a pointer to the Bench.
Reading three non-adjacent weeks, a marker sees the same template three times.
The brief names "repetitive weeks" as damaging the response criterion
specifically. The structure itself is fine and defensible — a course with a
declared weekly shape is a feature — but the *argument* has to differ visibly
week to week, and right now the third bullet is a cross-reference in ten of
twelve weeks.
**Fix:** add a required `claim:` frontmatter field — one sentence naming what
this week changes about the thesis, not what it covers — rendered at the top
of each lecture page and, more importantly, rendered as a **twelve-line
argument chain on `/lectures/`**. That page currently says "Each lecture
introduces one channel"; it should instead *be* the course's argument, visible
in one screen. This is the single highest-value artefact change in the plan:
it makes "one idea carried all the way" legible in ten seconds rather than
requiring twelve page visits.

**C3 — `lectures/index.mdx` hardcodes "Two lectures carry a slide deck."**
It will be wrong the moment this plan executes. Derive it or drop the count.

### D. Depth gaps

**D1 — No primary-source apparatus.** Eight papers are named in prose; none is
cited with venue, year, or link; there is no readings list on any page. For a
course whose second assessment requires citing "the original disclosure," the
course models the opposite behaviour. This is the biggest single depth gap and
the cheapest to close well.

**D2 — Transient execution (Spectre/Meltdown, 2018) is absent.** It is the
most consequential side-channel disclosure of the last decade and it is built
directly on week 6's primitive. Its absence from a twelve-week side-channel
course will read as a gap to any marker who knows the field. Two honest
options, both defensible, one required:
  - *(a)* Extend week 6 to cover it as the consequence of the cache channel —
    covered channel becomes the *transmitter* for a speculative *source*.
  - *(b)* Declare the boundary explicitly in week 6's lecture: this course
    teaches channels that leak what a program actually did, and transient
    execution leaks what it *speculatively* did, which is a different
    argument requiring different prerequisites — stated as a scope decision.
  **Recommend (b), stated in one paragraph, plus one line in week 12.** A
  deliberately argued exclusion reads as judgement; a silent omission reads as
  ignorance. This also protects the course's coherence claim, which is what
  the response criterion is actually marking.

**D3 — Week 2 under-delivers on its own description**, which promises "how far
the effect generalises" and then generalises only to other keyboards. Genkin,
Shamir & Tromer's 2014 acoustic extraction of an RSA key from a laptop's own
capacitors is the generalisation the description implies — sound, but not
mechanical sound.

**D4 — Defence is one week out of twelve.** Week 11 (constant-time software)
and half of week 5 (shielding cost). Masking and blinding — the standard
countermeasure class for A1 and week 3 — get a single outline bullet. Week 3's
"ahead of week 11's software-level treatment" promises a hardware treatment
that never arrives. Fix inside week 3 and week 11 rather than by adding a
week; there is no thirteenth week available.

---

## 3. Decision points — settle these before executing

**D-1. Figures.** CLAUDE.md currently bans imagery outright. A course about
measurement that shows zero measurements is the weakest thing about the
current artefact, and decks describing a power trace in prose are decks that
should not exist. Proposal: amend the rule to permit **inline SVG data
figures** — a trace, a timing scatter, a hit/miss histogram, a thermal decay
curve — authored from data in-repo, theme-aware, with `role="img"` and a
`<title>`; still no photography, no portraits, no hero art, no stock
illustration. This does not conflict with `check:evidence` (which gates
starter bitmaps in `src/assets/`), and it strengthens the original rationale
rather than abandoning it: there is nothing to look at, only measurements to
read.
**Recommendation: adopt.** Without it, tier-1 decks below lose most of their
reason to exist. If rejected, cut the deck plan to weeks 11 and 12 and spend
the effort on §2's A, B and C items instead.

**D-2. Course level.** `SLOP1979` is a 1000-level code, and the course
estimates mutual information, reads DPA traces, and rewrites for
constant-time. The three assigned digits (`979`) are fixed; the leading digit
is free and does not affect the mark — but plausibility does affect the
response criterion. `SLOP4979` fits the material. Keeping `1` is also
defensible *if* the home page's "no background assumed" claim is carried
through deliberately. Pick one and say which in `PROCESS.md`; do not leave it
as an unexamined default.

**D-3. Deck count.** Seven good decks beat twelve thin ones, and one
excellent deck beats seven rushed ones. §4 sets tiers with an explicit
stopping rule. Confirm the stopping point rather than discovering it at the
deadline.

---

## 4. The deck plan

### The decision rule (goes into CLAUDE.md)

> A lecture gets a deck when its argument is **stepwise and the steps are the
> point**: a trace revealed in stages, a table filled in column by column, a
> before-and-after pair. Prose that would become a bulleted summary of itself
> does not get a deck. A week without a deck must not refer to one.

That last clause is B1, turned into a rule.

### Tier 1 — build these (four decks)

| Week | Deck | Why it is stepwise | Fixes |
|---|---|---|---|
| 6 | **Flush, wait, reload** | the four-step primitive, one step per slide, then the hit/miss histogram that separates them; final slide contrasts PRIME+PROBE's different preconditions | B1, A2 |
| 4 | **Two clocks** | early-exit comparison timing built up from 1 to 10,000 samples, then the Montgomery extra-reduction two-peak plot the paper actually used | A1 |
| 11 | **Before and after** | the leaking function, the rewrite, and the two timing plots side by side — session 11 already calls this "the clearest single before-and-after pair the course produces" | D4 |
| 12 | **Six moves** | the design method run once, live, on one worked device and adversary; the last slide is the capstone brief restated as the method's output | closes the course |

### Tier 2 — build if tier 1 lands clean (three decks)

| Week | Deck | Why |
|---|---|---|
| 8 | **Residue** | only works after C1's Bench rewrite; the decay curve *is* the argument, and it is the one channel whose clock runs after the event |
| 5 | **The last 20 dB** | the shielding cost curve — a numbers week currently carried entirely by prose |
| 2 | **Sixty keystrokes** | waveform aligned against known text, revealed key by key; carries D3's generalisation on the closing slides |

### Not building, deliberately

Weeks 1, 3 (has one), 7, 9, 10 (has one). Week 7 is optical and image-free;
its Bench works from supplied photographs that cannot appear on the site, so a
deck would be prose about pictures. Weeks 1 and 9 are arguments, not
procedures. Record this as a decision in `PROCESS.md` — discarded work is
explicitly named in the HD process band.

### Quality bar for every deck (enforced by §5's test)

- ≥ 6 slides, ≤ 45 words on any content slide, one idea per slide
- opens on a question the deck answers, not a title card restating the lecture
- at least one slide that is a figure or a table, not bullets
- closes by naming what the Bench does with it
- legible at 1920×1080 **and** 390×844 — checked in a browser, not by build
- linked from its lecture via `slides:`; no orphan decks in `src/decks/`

---

## 5. Harness changes

Per CLAUDE.md, each lands as its **own commit**, separate from the content it
protects, so `PROCESS.md` can cite the rule and its effect as two facts.

**H1 — `spec/prose-promises.test.ts`.** Catches B1, B2, B3 as a class, not as
three edits. Contract: *the prose may not promise something the site does not
have.*
- any content file whose week refers to "the deck" → that week's lecture must
  set `slides:`
- any file referring to "the week's readings" → that week's lecture must carry
  a non-empty `readings:`
- any file naming an assessment must name it by its actual `title` — assert no
  content file contains `Assignment \d` unless an assessment of that title
  exists

**H2 — `readings:` in the lecture schema + `spec/citations.test.ts`.** Closes
D1 and makes it permanent. Schema: array of `{ authors, year, title, venue,
url? }`, minimum one per teaching lecture. Tests: every four-digit year
appearing in a lecture body as a paper year is matched by a reading with that
year; no reading is declared but uncited; every `url` is well-formed (the
build's link checker then verifies it resolves). Render as a **Readings**
section on each lecture page and aggregated on `/lectures/`.

**H3 — `channel:` in the lecture schema + `spec/argument-chain.test.ts`.**
Closes B4 permanently by deriving counts instead of writing them. Each lecture
declares `channel:` (`acoustic`, `timing`, … or `synthesis`). Tests: the
distinct channel count is computed, and the synthesis lectures'
`channelCount:` frontmatter must equal it; the week-10 deck's table must list
a row per channel; every `claim:` is unique and non-empty across the twelve
weeks. Prose stops containing bare numerals for things the data already knows.

**H4 — `spec/deck-policy.test.ts`.** The §4 rule, mechanised: no orphan decks;
every `slides:` resolves to a built deck (already covered) *and* to a source
file; minimum slide count; per-slide word budget; every deck's final slide
mentions its Bench. Word budget is a legibility proxy, not a substitute for
looking — §6 still applies.

**H5 — CLAUDE.md rules.** The deck decision rule (§4), the figures amendment
(D-1, if adopted), and the scope boundary from D2(b) written as a rule so a
later pass cannot quietly add a transient-execution week without arguing it.

---

## 6. Verification, manually

The checks cannot see any of this. After each content commit:

- open `/lectures/` at 1920×1080 and 390×844 and read the argument chain
  top to bottom — if it does not read as one compounding argument, the
  `claim:` lines are wrong, not the page
- open every new deck at both viewports, advance every slide, confirm nothing
  overflows and no figure collapses at 390 px
- tab through one lecture page and one deck: focus visible on every link, per
  CLAUDE.md's focus rule
- read weeks 4, 8 and 12 as a prospective student, in that order, skipping the
  weeks between — that is the marker's actual path
- throttle to slow 3G once and load a deck

---

## 7. Sequence

Ordered so the repo is green at every boundary and no commit mixes harness
with content. **Content lands first, then the harness rule that pins it** —
CLAUDE.md's "never commit a red state" is binding, so a test cannot be
committed before the content it holds to account. This inverts an earlier
draft of this section, which had the test land red as visible evidence of the
defect; that trades a rule the repo actually enforces for a rhetorical effect,
and the rule wins. The evidence survives anyway: the harness commit's message
and the test's header comment both record the defect the test was written
against, and `PROCESS.md` can cite the content commit and the harness commit
as the two halves of one decision.

| # | Commit | Contents | State |
|---|---|---|---|
| 1 | content | C1: week-8 Bench becomes a thermal decay measurement, week 10 absorbs the ranking; B4 counting fixed at source via `channel:`; week 9 rewritten as the precondition week; A1/A2/A3 corrections | done, green |
| 2 | content | `claim:` for twelve weeks, `axes:` as data on week 10, `/lectures/` rebuilt as the argument chain (C2, C3) | done, green |
| 3 | harness | H3 `spec/argument-chain.test.ts` + the CLAUDE.md rule it enforces | done, green |
| 4 | content | fix B1/B2/B3: week-6 session reworded, week-9 readings, "Assignment 1" → "Trace Analysis Lab" everywhere |
| 5 | harness | H1 `prose-promises` test — the contract that would have caught B1/B2/B3 |
| 6 | content | readings for all twelve weeks (D1), including the A4 correction to the prose that cites them |
| 7 | harness | H2 readings schema + citations test + lecture-page Readings rendering |
| 8 | content | tier-1 decks: weeks 6, 4, 11, 12 |
| 9 | harness | H4 deck-policy test + H5 CLAUDE.md rules (deck rule, figures, scope boundary) |
| 10 | content | B5 (report scope/date), D2 scope paragraph, D3 week-2 generalisation, D4 masking in weeks 3 and 11 |
| 11 | content | tier-2 decks: weeks 8, 5, 2 — **stop here if time is short** |
| 12 | docs | `PROCESS.md` rewrite |

Each harness commit must be *provably* load-bearing before it lands: mutate
the content it guards, watch the test fail with the message a future author
would read, revert. A test that has never been seen to fail is not evidence
of anything.

`PROCESS.md` must stay **400–600 words** and cite commits as links whose text
is the hash. It currently spends its length on decisions already made; the
rewrite should keep the concept-selection argument and replace the
commit-by-commit narration with the two decisions that best show judgement:
the prose-promises contract (a defect class closed at the harness level, not
three edits) and the week-8 deletion (content removed because it failed the
course's own "could this week be deleted" rule). Name the discarded work: the
five decks not built, and the transient-execution week not added.

---

## 8. If time runs out

Stop-loss order, most to least valuable per hour spent. The first three are
done; the list is kept whole so the ordering that produced them stays legible.

1. ~~A1, A2, A3 — factual errors, cheap to fix, expensive if a marker spots one~~
2. ~~C2/B4 — the `/lectures/` argument chain and the counting fixed at source,
   the highest-visibility change here~~
3. ~~C1 week-8 rewrite~~
4. B1, B2, B3 with H1 — one defect class, closed at the harness level
5. D1 readings with H2
6. Tier-1 decks, in the order given
7. Everything else

The ship gate is unchanged and non-negotiable: `pnpm check` **and**
`pnpm check:evidence` both run locally well before the flip, because per
CLAUDE.md the first public push is the first time CI has ever run.
