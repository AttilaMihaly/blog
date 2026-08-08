---
title: "The Bottleneck Was Never the Code"
description: "We spent two years making each developer faster. Amdahl's law has something to say about that."
pubDate: 2026-08-08
tags: ["ai", "software-engineering", "coordination", "morphir"]
draft: true
---

For most of my career I believed a simple thing: to make a team faster, make each engineer faster. Better languages, better tools, better abstractions. I never questioned it. Of course I didn't — it worked. Nearly everything I shipped in twenty years of writing software followed that logic, and most of it paid off.

Then I started paying attention to the problems we never solve.

Famines happen inside functioning food distribution systems. Amartya Sen showed this decades ago and nobody has seriously disputed it since. Cities with housing shortages know exactly how to build housing — the drawings exist, the contractors exist, the demand is screaming. And closer to home: we have known how to write maintainable software since at least the seventies. Parnas published on information hiding in 1972. Simply put, the knowledge is not missing.

So why are these problems still here?

## Not a Knowledge Deficit

Notice what all three have in common. In each case the solution is known, written down, and unimplemented. Nobody is stuck because they cannot think of the answer. They are stuck because getting from "the answer is known" to "the answer is applied" requires several parties with different information and different incentives to agree, and that step keeps failing.

This is not a hard problem in the way that hard problems are hard. It is a different kind of problem entirely.

Arrow's impossibility theorem says that no procedure for aggregating individual preferences into a group decision satisfies a short list of entirely reasonable conditions. Not "we haven't found one yet." There isn't one. It's a theorem. Gibbard–Satterthwaite adds that any reasonable voting system can be gamed by strategic misrepresentation. These results do not soften as the participants get smarter.

And of course most coordination failures are not failures at all. They are somebody's working solution. Zoning is not a puzzle homeowners cannot crack — it's a mechanism they built and defend, and it does exactly what they want. A participant who is better at finding Pareto improvements contributes nothing here, because the blocker is not ignorance of a better allocation. The blocker is a party who prefers the current one.

Unfortunately, this is the part of the problem that improves least when you add capability.

## Where Six Weeks Goes

Now apply that to our own domain.

Take a feature that took your team six weeks and run the honest audit. How much of that was somebody typing code?

In my experience it is a small fraction. The rest went to deciding what to build. Discovering three weeks in that what the business asked for and what the specification said were different things. Finding out another team already solved this, differently, and now there are two answers in the codebase. Waiting for review from the one person who holds the context in their head. Reconstructing a mental model six months later from a document that stopped describing the system a long time ago.

Every one of those is the same problem as the famine and the housing shortage, at smaller scale. The knowledge exists. It is distributed across people who represent it differently and who are measured on different things. The work is not producing the knowledge. The work is reconciling it.

This means that making each of those people faster at producing their own representation does not obviously help. In fact it may hurt. More representations, produced faster, still unreconciled.

Amdahl gave us the shape of this in 1967. Speed up one part of a system and your total gain is bounded by how much of the runtime that part accounted for. We all know this. We apply it rigorously to code and then forget it completely when we think about organizations.

> We have spent two years parallelizing the part that was never the bottleneck.

## Back to Reality

This is where I have to be careful, because the number everyone quotes is no longer the number.

In July 2025, METR ran a randomized controlled trial — a real one, with 16 experienced developers working 246 real issues in repositories they had contributed to for years. The developers forecast a 24% speedup from AI tools. Afterwards they reported a 20% speedup. The measured result was a 19% *slowdown*.

That result made the rounds, and I quoted it myself. But METR published a follow-up in February 2026 and now flags the original as historical. For developers who returned to the study, they estimate a speedup instead. Agentic tools arrived in between, and those are a different thing than the autocomplete-shaped assistants of early 2025. If you are still citing the 19% figure as current, stop.

So the individual gains are real. Let's grant it fully: on a well-scoped change in a codebase with clear structure, the machine writes it faster and cleaner than I do. I have no interest in the argument about whether that's true. It's true.

Here is the question that survives. Adoption is near-universal. Individual speedup is measurable. So name the organizations whose delivery has visibly compounded in proportion.

I can't. What I see instead looks like churn — teams metabolizing new tools, re-litigating conventions, and shipping at roughly the pace they shipped before.

The code is leaving a trace, though. GitClear has been measuring change patterns across hundreds of millions of commits, and the shape is consistent. Duplicated blocks are at the highest level on record. Refactoring collapsed from 21% of changed lines in 2022 to under 4% today, while copy/paste went the other way. And function connectivity — how often newly written code calls into code that already exists — is down 35% since 2023. New code increasingly sits isolated in self-contained files.

Notice what that describes. It is not bad code. It is *unreconciled* code. Every one of those metrics measures how well a change fits into what somebody else already built, and every one of them is moving the wrong way while individual output moves up. That is the signature of a coordination problem, not a capability one.

And the finding that did survive the correction is the one almost nobody quotes, though it should worry us most. Those developers experienced the slowdown firsthand and still reported being sped up. Whatever is happening at the organizational level, we cannot detect it by asking people how it feels. "It feels much faster" is currently the entire evidentiary basis for most enterprise AI strategy.

## But Maybe It's Just Early

The obvious objection is that this is a J-curve. Learning cost now, payoff later. And this is exactly what the productivity paradox looked like in 1987, when Solow observed that computers were visible everywhere except in the productivity statistics. It took roughly fifteen years to resolve.

I take this seriously and I cannot rule it out from inside it. But notice what the J-curve explanation actually predicts: the constraint is unfamiliarity, so the gap closes as familiarity grows. That is testable, and I do not see it closing where familiarity is highest.

## The Artifact

So what would coordination between people and machines actually look like, if we treated it as the problem?

Let me start somewhere unfashionable. Excel is the most successful coordination technology our industry has ever produced, and we hate admitting it. A domain expert authors the logic directly. The artifact is simultaneously the specification and the running system. Somebody else opens it and can see what it does. Of course it is a disaster on every axis we care about — no types, no version control, no tests, logic buried in cells. But it solved the boundary problem, and forty years of better-engineered alternatives did not.

Now imagine a specification with Excel's property and none of its failures. Domain experts author it in language they will actually write. It is precise enough that a machine can check it and generate from it. When the business and engineering disagree, the disagreement surfaces as a diff in a shared artifact — not as a discovery three weeks into implementation.

That last part is load-bearing. Coordination needs a durable object that several parties with different agendas can read, edit, and *disagree inside of*. A meeting is not that — it is serialized and dominated by whoever talks most. A chat transcript is not that — it is private, ephemeral, and leaves no shared state behind. Code is not that — it is legible to exactly one of the parties. And a prose specification is not that either, because nothing checks it, so it rots the day after it's written.

In that picture the model's job changes completely. It is not producing more code faster. It is translating across the boundary between representations and keeping the artifact and the system from drifting apart.

## Single Player

Spec-driven development is the industry's first real move in this direction and I want to give it full credit. But look at how it is framed today: one developer, writing a better prompt, getting a better result.

That is single player. It is individual productivity wearing a coordination costume.

The interesting version is multiplayer, and I don't see anyone building it.

## What I Have So Far

I took a stab at this with Morphir Substrate — markdown-native specifications that domain experts author directly, feeding deterministic generators that LLMs orchestrate rather than replace, producing code across multiple targets. I have been stress-testing it against US liquidity regulation, which is unforgiving enough to be a real test of whether the representation holds.

I want to scope this honestly. The thesis is untested. It cannot be tested by one person, because coordination requires at least two parties with divergent agendas, and so far I have mostly been arguing with myself. The experiment I need is one domain expert and one engineer working the same specification and disagreeing in it. That is the next step. Everything past it is deferred.

> **Important note:** none of this says AI capability doesn't matter. If capability keeps compounding while our ability to aggregate decisions stays where it is, we have not made anything safer — we have handed much more power to an unchanged mechanism. My claim is narrower. Capability is not where the remaining organizational gains are, and we are spending as if it were.

Here is what would prove me wrong. If organizations adopting agentic coding show durable gains in both throughput and stability, without changing how decisions get made or how specifications are represented, then capability was the bottleneck and I was looking in the wrong place.

If you are working on the coordination side of this — in tooling, in specification languages, in decision infrastructure, in anything that treats the gap between people as the engineering problem rather than the overhead — I would like to hear from you.

What do you think?

---

## References

**Coordination and social choice**

- Kenneth J. Arrow, *Social Choice and Individual Values*, Wiley, 1951. The impossibility theorem.
- Allan Gibbard, "Manipulation of Voting Schemes: A General Result," *Econometrica* 41(4), 1973.
- Mark A. Satterthwaite, "Strategy-proofness and Arrow's Conditions," *Journal of Economic Theory* 10(2), 1975.
- Amartya Sen, *Poverty and Famines: An Essay on Entitlement and Deprivation*, Oxford University Press, 1981.

**Computing history**

- Gene M. Amdahl, "Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities," *AFIPS Conference Proceedings* 30, 1967.
- David L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules," *Communications of the ACM* 15(12), 1972.
- Robert M. Solow, review of *Manufacturing Matters*, *New York Times Book Review*, 12 July 1987. The origin of the productivity paradox.

**AI and developer productivity**

- Joel Becker, Nate Rush, Beth Barnes, David Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, July 2025. [Blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [arXiv:2507.09089](https://arxiv.org/abs/2507.09089)
- METR, "We Are Changing Our Developer Productivity Experiment Design," February 2026. [Blog](https://metr.org/blog/2026-02-24-uplift-update/)
- GitClear, "The Maintainability Gap: 2026 AI Code Quality Research." [Report](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)

---

<!--
NOTES BEFORE PUBLISHING

Placeholders to fill with your own material:
- The opening would be stronger with one concrete memory instead of a general claim about your career. A specific project where you optimized individual throughput and the team didn't get faster.
- "What I see instead looks like churn" — deliberately vague. If you can make it concrete without naming your employer, that paragraph carries the whole post.

Verify before publishing:
- METR July 2025 RCT — full numbers: 16 devs, 246 tasks, forecast 24% speedup, self-reported 20% speedup, measured 19% slowdown, CI +2% to +39%.
- METR Feb 2026 update — returning cohort -18% (CI -38% to +9%), new cohort -4% (CI -15% to +9%). METR notes selection effects and calls the evidence weak. Don't overstate this in either direction.
- GitClear figures are pulled from their 2026 maintainability report: block duplication at record high, moved code 21% (2022) to 3.8% YTD 2026, copy/paste 9.4% to 15.7%, function connectivity down 35% since 2023. Read the report yourself before publishing — I'm working from their summary page, not the full methodology.
- I dropped an earlier claim that per-developer code volume is up ~75%. That number circulates widely but traces to a secondary aggregator, and GitClear's own figure is ~10% more durable code since 2022. Don't reintroduce it.
- Solow 1987 — I paraphrased rather than quoted. If you quote directly, check the wording against the original review.

Decide:
- Whether to name Morgan Stanley or keep the regulatory example generic. Check the external-writing policy first.
- Correct public link for Substrate.
- The Excel section is the biggest departure from the previous draft, the most likely thing to get quoted, and the most likely thing to annoy people. Your call.
-->
