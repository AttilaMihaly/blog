# Blog Style Guide

Derived from analysis of 18 blog posts (2010–2019) and 8 GitHub discussion proposals (2021–2024). Use this to tune generated drafts toward the author's actual voice.

---

## Voice and Perspective

First person throughout. The author is a participant in the story, not an observer — uses autobiography as framing: "I was working at a company," "I remember reading the RDF spec," "I was a believer myself." This is not decoration; it establishes credibility and invites the reader into a shared intellectual journey.

Tone is confident but not arrogant. Admits past mistakes and wrong beliefs openly ("I was totally convinced. OOP is the best way...") before pivoting to the insight that changed that view. This creates the rhetorical structure: believer → crisis → revelation.

Direct with a dry wit. Occasional irony ("the very realistic problem of printing an array of characters") or pointed understatement ("no wonder they failed"). Not jokes — just the natural sarcasm of someone who has seen too many bad decisions.

---

## Sentence Structure

Mix short and long deliberately. Short sentences land emphasis. Long ones build argument.

> We went full circle back to complete separation of data and logic. But why? When did OOP break?

Starts sentences with "But", "So", "And", "Yes" — informal connectives that maintain forward momentum. Never sounds academic.

Rhetorical questions are a primary device — used mid-paragraph to transition, not just at openings. Often answered immediately, or left as a provocation for the reader.

> Can non-technical people solve problems with your favorite programming language? Can they do the same with Excel?

---

## Recurring Rhetorical Patterns

**Setup and subversion.** State the common wisdom as if it is obviously true, then pull the rug:
> Simple, right? Yes, very simple. In fact, it's too simple to be true.

**Observation then interrogation.** State a fact bluntly, then immediately question it:
> We went full circle back to complete separation of data and logic. But why? When did OOP break?

**"Of course" as pivot.** Used to concede common ground before redirecting:
> Of course there are ways to get around that but that involves creating nodes that represent a triple which makes the model incredibly complex.

**"Imagine" for constructive turns.** When moving from problem to proposed solution:
> Now let's imagine a platform that looks at the system as a whole...

**Blockquote as section conclusion.** Key insight statements are pulled into blockquotes, distilled to one or two sentences. Used sparingly (once per post at most).

**Grounding in precedent.** When proposing something new, names a known successful solution first, then pivots to the question: "One of the most successful solutions to this problem is Microsoft's LINQ... What if we did something similar in Morphir?" This is not a literature review — it's a rhetorical move that borrows credibility and frames the proposal as an application of proven ideas rather than speculation.

**Analogical bridge via computing history.** Draws comparisons to well-known computing concepts to make unfamiliar problems tractable: "This problem is similar to static vs. dynamic linking in other languages." Favors CS history over pop culture analogies in technical contexts.

**Incremental framing.** Proposals are explicitly scoped to a bounded first step, with future extensions acknowledged but deferred: "We could start by...", "Initially we would define X as an add-on...", "We might lift this limitation in the future but..." This is not hedging — it's deliberate risk management stated plainly.

**"Important Note" preemption.** The strongest objection to a proposal is addressed before anyone raises it, formatted as a blockquote with a bold prefix. Used to neutralize scope concerns and establish the author's awareness of tradeoffs.

---

## Structure and Flow

**Earlier posts (2010–2013):** Free-flowing prose without section headers. Starts with a hook — a personal observation, an industry failure, or a provocative question — and builds through a single continuous argument.

**Later posts (2014+):** More structured, with H2 headers when the topic is complex or technical. Headers are noun phrases or short provocative questions, not process labels ("The Conflict", "The Lie", "Getting Closer").

**Technical proposals (2021–2024):** When writing for a community or proposing a change, the structure shifts to: problem statement (often an explicit section) → current limitation → concrete proposal (often with code) → benefits (bulleted) → open invitation. The prose within each section is the same voice; only the frame changes.

**Opening pattern:** Almost never states the thesis upfront. Instead opens with a scene, a memory, a contradiction, or community context ("In one of our recent community calls..."). The point emerges through the argument.

**Closing pattern:** Lands on a concrete insight or, in collaborative writing, an explicit invitation for input: "What do you think?" or "What does everyone think?" Sometimes closes by tagging specific people. Does not trail off or summarize what was just said.

---

## Technical Writing

Code examples are short and purposeful. Never more code than the idea requires. Progression follows: naive/broken approach → problem identified → corrected version. The narrative around the code carries as much weight as the code itself.

Comments in code are sparing. Inline comments (`// this is a lie`, `// above the speed of sound`) are used for effect, not explanation.

Comparison tables and formulas appear in type-theory posts but are introduced informally, not pedantically.

---

## Word Patterns

**Frequently used:**
- "simply" / "simply put"
- "of course" (at least once per post, often more)
- "unfortunately" (marks the turn to a caveat or problem)
- "notice that" (points at key insights within examples)
- "in fact" (signals a contradiction of what was just stated)
- "while X, Y" (concedes a point before pivoting: "While this is a simple approach that works, the community brought up...")
- "This means that..." (draws a conclusion from the example just shown)
- "To get things started..." (lowers the bar for participation, invites extension)
- "I took a stab at that" (humble framing for an initial proposal)
- "This is what I have so far" (explicitly unfinished, inviting collaboration)
- "domain", "model", "abstraction", "boundary", "unification", "declarative"

**Avoided:**
- Hedging phrases ("it might be the case that", "some would argue")
- Passive constructions where active is possible
- Marketing language ("cutting-edge", "game-changer", "paradigm shift" used earnestly)
- Academic citation style
- Sycophantic openers or closers

**Addressing the reader:** Uses "you" and "we" freely, often switching within a paragraph. "You" for the individual developer's experience; "we" for the shared situation or community. In solo essays, "I" is load-bearing — personal history, personal conviction. In proposals, "we" dominates and "I" marks personal perspective within a shared effort ("I think one of the first things we should decide is...").

---

## Analogies and Metaphors

Reaches for physical-world analogies: factory machines, cookie monsters eating missiles, a god creating objects with `new`, a car with fuel level. These are not throat-clearing illustrations — they are load-bearing. The "complexity is like a monster" analogy in "Let's Face Complexity" drives the entire argument.

Historical framing: frequently references past decisions and their consequences ("they failed", "by now a standard") to position the current argument as the lesson learned.

---

## Topics and Themes

Recurring subjects:
- Programming language design: type systems, multiplicity, functional vs. OOP
- Criticism of industry practices: rewrites, complexity management, OOP dogma
- Code generation and developer productivity
- Lambda Core (personal language project, 2014–2017 era)
- Morphir IR design: composability, type modeling, relational algebra, tooling (2021–2024)
- The tension between abstraction and pragmatism

The posts are not tutorials. They are arguments. Each one has a position and builds toward it. Even the Java post ("Identity vs. Equality") is framed as correcting an anti-pattern, not teaching a concept. The GitHub discussions are proposals, but they follow the same logic: here is a gap in what exists, here is a better approach, here is why it's better.

---

## What Generated Posts Should Do

**For essay-style posts:**
- Open with a scene, contradiction, or question — not a thesis statement
- Build the argument through personal experience and industry observation
- Use rhetorical questions to move between ideas
- Keep code examples minimal and surrounded by prose that carries the argument
- Land on one sharp insight, optionally blockquoted
- Use the "I was wrong, then I saw this" arc when introducing new ideas
- Avoid bullet lists for main arguments; use them only for comparisons or inventories
- Do not soften claims with unnecessary hedges
- Reference real languages (Java, Scala, Haskell, SQL) as concrete anchors

**For proposal-style posts:**
- Open by anchoring to community or industry context, not to the author's opinion
- State the problem before stating the proposal; make the pain tangible first
- Name a successful prior art before introducing your approach ("X solved this well; what if we applied it here?")
- Scope the proposal explicitly — name what it covers and what it deliberately defers
- Preempt the strongest objection with a blockquoted "Important Note" before others raise it
- Close with a genuine open question, not a rhetorical one: "What does everyone think?"
- Bullet lists are appropriate for benefits and feature mappings; prose still carries the argument

**In both modes — never:**
- Summarize what you just said at the end
- Use passive voice to soften a claim you actually believe
- Open with the conclusion
