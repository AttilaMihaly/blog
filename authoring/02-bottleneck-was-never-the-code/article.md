---
title: "The Bottleneck Was Never the Code"
description: "Agentic tools made me faster. My team didn't get faster. Here's where I think the gap comes from."
pubDate: 2026-08-08
tags: ["ai", "software-engineering", "coordination", "morphir"]
draft: true
---

For most of my career I believed a simple thing: to make a team faster, make each engineer faster. Better languages, better tools, better abstractions. Of course I believed it — it worked, over and over, for twenty years.

Then agentic coding tools showed up and did more for my individual speed than most of what I shipped in that time. On a well-scoped change in a codebase with clear structure, the machine writes it faster and often cleaner than I do. I have no interest in arguing about whether that's real. It's real.

And my team is not meaningfully faster.

That gap has been bothering me for about a year. What follows is where I think it comes from. I'm not certain about it, and I'll say at the end what would change my mind.

## A Problem We Already Solved

In 1847, Ignaz Semmelweis had the doctors at Vienna General Hospital wash their hands in chlorinated lime between the autopsy room and the maternity ward. Mortality in his clinic fell from double digits to around two percent. It took roughly forty years for handwashing to become standard practice, and when it did, it arrived on the back of germ theory rather than on the back of his evidence.

Part of why he failed is worth sitting with. Statistical argument was unusual in medicine at the time, and he published long tables of raw numbers with no summary and no graphs. The knowledge existed and it was correct. The artifact carrying it wasn't legible to the people who had to act on it.

I think a lot of our problems in software have this shape, and I think we keep misdiagnosing them as knowledge problems.

## Where Six Weeks Goes

Take a feature that took your team six weeks and run the honest audit. How much of that was somebody typing code?

In my experience it's a small fraction. The rest went to deciding what to build. Discovering three weeks in that what the business asked for and what the specification said were different things. Finding out another team already solved this, differently, and now there are two answers in the codebase. Waiting on review from the one person who holds the context in their head. Reconstructing a mental model six months later from a document that stopped describing the system a long time ago.

Notice what those have in common. The knowledge exists in every case. It's distributed across people who represent it differently and who are measured on different things. The work isn't producing the knowledge. It's reconciling it.

This means that making each of those people faster at producing their own representation may not help much. It might even hurt — more representations, produced faster, still unreconciled.

There's a reason to think reconciliation is hard in a way that resists tooling. Arrow's impossibility theorem shows that no procedure for combining individual preferences into a group decision satisfies a short list of reasonable conditions. That result is about voting systems, and I want to be careful not to overclaim it — a design review is not an election. But it suggests that aggregating preferences has a floor that isn't lifted by making the participants sharper, and that matches what I see when a technical disagreement stays unresolved for three sprints.

## Amdahl's Other Half

Amdahl's law says that when you speed up one part of a system, your total gain is bounded by how much of the runtime that part accounted for. Halve the time on something that was 20% of the work and you've bought yourself 10%, no matter how good the optimization was.

We apply this rigorously to code. We ask what fraction of the runtime a function accounts for before we optimize it, because we learned the hard way that optimizing the wrong function is wasted effort.

Then we walk into the AI conversation and skip that step entirely. I have not seen a serious attempt to measure what fraction of a delivery cycle is code production before concluding that faster code production is the win.

> The gains are real. They're just landing on the part of the work that was never the constraint.

## The Numbers

The measurement here is genuinely unsettled and I'd rather show that than pretend otherwise.

METR ran a randomized controlled trial on experienced developers working real issues in their own repositories. Their 2025 result showed a slowdown; their February 2026 follow-up estimates a speedup for the developers who returned. METR flags the earlier result as historical and notes selection effects in the newer data, with confidence intervals wide enough to include no effect at all. My reading is that individual gains are probably real now and smaller than the marketing suggests.

One finding from the original study survived, and it's the one I keep thinking about. Developers estimated a 24% speedup beforehand and reported a 20% speedup afterwards, while the measurement said otherwise. Whichever direction the true effect runs, we apparently can't detect it by asking people how it feels — which is most of what enterprise AI strategy currently rests on.

The code itself may be a better witness. GitClear measures change patterns across a large commit dataset, and their 2026 report describes duplicated blocks at the highest level they've recorded, refactoring falling from 21% of changed lines in 2022 to under 4%, copy/paste rising, and function connectivity — how often new code calls into code that already exists — down 35% since 2023. This is one vendor's dataset and worth reading with that in mind.

But notice what those metrics measure. Not whether code is good. Whether a change fits into what somebody else already built. They're all moving one way while individual output moves the other, and that's closer to a reconciliation problem than a capability one.

## But Maybe It's Just Early

The obvious objection is that this is a J-curve — learning cost now, payoff later. This is roughly what the productivity paradox looked like in 1987, when Solow observed that computers were visible everywhere except in the productivity statistics, and it took years to resolve.

I take that seriously and I can't rule it out from inside it. But the J-curve explanation predicts something specific: the constraint is unfamiliarity, so the gap closes as familiarity grows. That's testable, and I don't see it closing where familiarity is highest. I could be looking at too small a sample.

## The Only Reader

Spec-driven development is the industry's most serious move toward treating the artifact as the thing that matters, and I want to be fair to it. The specifications get checked into version control alongside the code. They evolve with the system. Several people can read them, review them, and change them. That's multiplayer by design, and the criticism that it's prompt engineering with extra steps doesn't hold up.

The problem isn't the design. It's who actually shows up.

The specs are enormous, and they're prose. Developers skim them at review time and then go read the code, because given a thousand words describing a behaviour and the forty lines that implement it, the code is the faster and more reliable answer. Stakeholders read the section they wrote and not much else. Too long, too many words, and no way to see the shape of the thing without reading all of it.

There's exactly one party that reads the whole document, every time, without complaint. It's the model.

So the artifact we built to hold shared understanding has quietly turned into a prompt. It has one reader, and that reader has no stake in the disagreement — it can't tell you the spec contradicts what somebody said in a meeting last week, because it wasn't in the meeting and doesn't care. We didn't get to multiplayer. We got to single player, and the player is the AI.

Which is the same failure as Semmelweis publishing his tables without a graph. The information is there and it's correct. Nobody can get at it.

My instinct is that part of the answer is visual — that a diagram or a worked example does in ten seconds what four pages of prose does badly. But that's an instinct, not a finding.

## One Possible Direction

I'd rather leave the problem open than pretend I've solved it, so take the rest of this as one direction among several.

Excel is arguably the most successful coordination technology our industry has produced. A domain expert authors the logic directly. The artifact is simultaneously the specification and the running system. Somebody else opens it and can see what it does without reading four pages first. Of course it's a mess on every axis we care about — no types, no meaningful version control, no tests, logic buried in cells. But it solved the boundary problem between domain experts and software, and forty years of better-engineered alternatives mostly haven't.

So: a specification with Excel's legibility and fewer of its failures. Authored in a form domain experts will actually work in, precise enough that a machine can check it and generate from it, and structured so that disagreement between business and engineering shows up as a diff rather than as a discovery three weeks into implementation.

Whether or not that particular shape turns out to be right, the requirement underneath it seems solid to me. Reconciliation needs a durable object that several parties can read, edit, and disagree inside of. A meeting isn't that — it's serialized and dominated by whoever talks most. A chat transcript isn't that — it's private, ephemeral, and leaves no shared state. Code isn't that — it's legible to exactly one of the parties. And prose specifications, as above, turn out not to be either.

If that's right, the model's job changes. Not producing more code faster, but translating across the boundary between representations and keeping the artifact and the system from drifting apart.

## What I Have So Far

I took a stab at this with Morphir Substrate — markdown-native specifications that domain experts author directly, feeding deterministic generators that LLMs orchestrate rather than replace, producing code across multiple targets. I've been stress-testing it against US liquidity regulation, which is unforgiving enough to be a real test of whether the representation holds.

I'd rather be clear about what this is. It's a bet on one shape of answer to a problem I'm more confident about than the answer. The thesis is untested, and it can't be tested by one person, because reconciliation needs at least two parties with different information and different incentives — so far I've mostly been arguing with myself. The next step is one domain expert and one engineer working the same specification and disagreeing in it. Everything past that is deferred.

> **Important note:** none of this says capability doesn't matter. If capability keeps compounding while our ability to reconcile decisions stays where it is, that's not obviously a safer place to be. My claim is narrower — that capability may not be where the remaining organizational gains are, and we're spending as if it clearly were.

Here's what would change my mind. If organizations adopting agentic coding show durable gains in both throughput and stability, without changing how decisions get made or how specifications are represented, then code production was the constraint and I was looking in the wrong place.

If you're working on the reconciliation side of this — in tooling, in specification languages, in anything that treats the gap between people as the engineering problem rather than the overhead — I'd like to hear from you.

What do you think?

---

## References

- "Ignaz Semmelweis," *Wikipedia*. [Article](https://en.wikipedia.org/wiki/Ignaz_Semmelweis)
- "Ignaz Semmelweis," Science History Institute, scientific biography. [Article](https://www.sciencehistory.org/education/scientific-biographies/ignaz-semmelweis/)
- Kenneth J. Arrow, *Social Choice and Individual Values*, Wiley, 1951.
- Gene M. Amdahl, "Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities," *AFIPS Conference Proceedings* 30, 1967.
- Robert M. Solow, review of *Manufacturing Matters*, *New York Times Book Review*, 12 July 1987.
- Joel Becker, Nate Rush, Beth Barnes, David Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, July 2025. [Blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [arXiv:2507.09089](https://arxiv.org/abs/2507.09089)
- METR, "We Are Changing Our Developer Productivity Experiment Design," February 2026. [Blog](https://metr.org/blog/2026-02-24-uplift-update/)
- GitClear, "The Maintainability Gap: 2026 AI Code Quality Research." [Report](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)

---

<!--
NOTES BEFORE PUBLISHING

Fill in with your own material:
- The opening is stronger with a specific memory than a general claim about your career — a project where you optimized individual throughput and the team didn't get faster.
- "My team is not meaningfully faster" is deliberately unspecific. If you can make it concrete without naming your employer, that line carries the post.

Verify:
- METR July 2025: 16 devs, 246 tasks, forecast 24% speedup, self-reported 20% speedup, measured 19% slowdown (CI +2% to +39%).
- METR Feb 2026: returning cohort -18% (CI -38% to +9%), new cohort -4% (CI -15% to +9%). I deliberately kept the numbers out of the prose and described the direction instead — putting the figures back in invites an argument the post doesn't need.
- GitClear figures from their 2026 maintainability report. Read the methodology before publishing; I'm working from their summary page.
- I dropped an earlier claim that per-developer code volume is up ~75%. It circulates widely but traces to a secondary aggregator, and GitClear's own figure is ~10% more durable code since 2022. Don't reintroduce it.
- Semmelweis: spelling is Ignaz Philipp Semmelweis (Hungarian: Semmelweis Ignác Fülöp), 1818–1865. Chlorinated lime handwashing introduced at Vienna General Hospital's First Obstetrical Clinic in 1847; doctors' wards had roughly three times the mortality of the midwives' wards beforehand. Sources put the drop at somewhere between 12–18% down to 1–2%, so "double digits to around two percent" is the safe phrasing. He was forced out of Vienna in 1849 and published his book in 1861. Handwashing became routine around 1890 via germ theory, so the ~40 year figure holds.
- Solow 1987 — paraphrased, not quoted. Check wording if you quote directly.

Decide:
- Whether to name Morgan Stanley or keep the regulatory example generic. Check the external-writing policy first.
- Correct public link for Substrate.
-->
