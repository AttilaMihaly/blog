# Who Owns Your Knowledge?

Something has shifted in the last couple of years. Thinking without AI, apparently, has been cancelled.

I don't mean that literally — I mean the social version. Every conversation about technology, every meeting about solving a business problem, has to include AI somewhere in the agenda or people stop paying attention. Some meetings I've attended have simply been renamed to include "AI" in the title. Not because the content changed. Because it had to. The new format: tell us how you're using AI, not how you're building good technology. The assumption being that those are the same thing.

I'm on the technology side of this, and I find the tools genuinely interesting. But something about the framing bothers me. There's a reason it's called *information* technology. Over the decades, the field built hard-won expertise in managing large amounts of information — the structures, the tradeoffs, the failure modes. That intellectual capital didn't come from nowhere. It accumulated, slowly, in organizations and in people.

What I'm watching now is that capital being described as commoditized. But commoditized isn't quite the right word. The knowledge isn't disappearing. It's being privatized — moving from your organization into the training data, the inference infrastructure, and the roadmap of a handful of vendors. And that process is still going on.

To understand the mechanics of it, consider the scale of what we're actually working with.

*(See: scale visualization)*

A model like GPT-4 was trained on roughly 13 trillion tokens — more text than anyone could read in thousands of lifetimes. Its context window, where your actual conversation happens, holds around 128,000 tokens. A typical enterprise prompt: maybe a thousand. Your company's contribution to that exchange is a rounding error. The model doesn't learn from your question. It arrives knowing almost everything it's going to know, and you steer it slightly. The intelligence was assembled elsewhere.

---

## The Moat That Isn't There Anymore

Companies that compete on knowledge — consulting, engineering, finance, life sciences — have always told a version of the same story: we win because we know things others don't. The specific failure modes. The regulatory edge cases. The reason the architecture looks the way it does. That knowledge lives in people. It's imperfect, unevenly distributed, poorly documented. But it's yours.

Or it was.

When a knowledge worker uses an AI to reason through a domain problem, the model does the cognitive heavy lifting using its generalized knowledge. Your employee doesn't need to develop deep expertise if the model can always fill the gap. Of course, that's the value proposition. That's also the trap. Because the expertise that would have accumulated in your organization — through doing the hard work, making the mistakes, capturing the lessons — never does. The gap between what your people know and what the model provides becomes invisible, and then it stops mattering, which is when it becomes permanent.

A single query doesn't hollow out a company. But this happens at scale, across teams, for years. And nobody notices because the outputs keep coming.

---

## The Paradox of Useful Tools

Here's what makes this hard to reverse: the more capable the AI, the stronger the pressure not to bother documenting anything.

Why write up a decision carefully when you can reconstruct the reasoning with a prompt later? Why build a real knowledge base when the model synthesizes answers from scattered inputs? Why mentor someone slowly through a complex domain when the AI walks them through it in five minutes?

Each of those choices is individually rational. Collectively, they accelerate the erosion. The institutional knowledge that would have been captured — imperfectly, slowly — in documents, postmortems, and conversations never gets written. The productivity pressure makes it worse. Teams adopting AI most aggressively are the ones least likely to stop and ask whether they're producing anything durable. In fact, I'd argue the most dangerous version of AI adoption is the one that looks most successful. Outputs are high, velocity is up, costs are down. Nobody asks what's missing, because nothing appears to be missing.

---

## "But We Use RAG"

The common answer to the outsourcing concern is to bring your documents into the context window — retrieve relevant material at query time, let the model reason over your data, and get domain-specific answers. Fine-tuning goes further: adjust the model's weights on your proprietary corpus, and now you have something the competitor doesn't.

Both are real techniques. Unfortunately, neither is what companies think they are.

RAG is only as good as your documentation, and most organizations' internal documentation is a graveyard. Outdated wikis. Half-finished Confluence pages. Meeting notes nobody reviews. The reasoning still happens inside the vendor's model. You're supplying raw material to someone else's factory.

Fine-tuning gives you a behavioral adjustment you cannot read. You cannot inspect what was learned, correct a specific misunderstanding, or explain to a stakeholder why the model believes what it believes. Notice that this is not a technical limitation likely to be solved next quarter — it's fundamental to how weights encode information. If your knowledge strategy depends on artifacts you cannot open and verify independently, you don't own that knowledge. You're renting it, and the terms can change.

---

## The Contract Won't Save You

The other reassurance I hear is about the data agreement. Most enterprise AI contracts include a clause: your input won't be used to train the model. The implicit assumption is that your competitive advantage lives in your private data, and as long as that stays private, it stays yours.

But think about where your subject matter experts actually learned what they know. Most of it came from public sources — papers, documentation, industry publications, open forums, conferences. The accumulated expertise of a senior engineer or analyst is not primarily made of company secrets. It's made of years of engaging with publicly available knowledge and developing judgment about how to apply it.

AI companies don't need your internal documents to replicate that. They already have access to the same sources your experts learned from. A sufficiently capable model trained on enough public data can often derive what your organization would conclude — not because it knows your business specifically, but because it knows the field deeply enough to reconstruct the reasoning. The contract keeps your specific data private. It doesn't keep your expertise from being approximated.

So the erosion happens either way. Your differentiating factor was never the data. It was the people who could interpret it. And those people are now working alongside tools that are very good at interpretation.

---

## The Actual Alternative

The tools aren't the problem. The default workflow is.

Most organizations use AI as a substitute for knowledge accumulation. The alternative is to use it as an accelerant in the opposite direction. Have the model help formalize what your experts know. Turn conversations into structured decision records while the context is still fresh. Surface inconsistencies in your existing documentation and fill the gaps while the people who know are still around to review the output.

The goal is to produce artifacts that are human-readable, auditable, and owned by your organization. Not embeddings in a vector store that nobody can interpret. Not weights in a model you don't control.

> The companies that get this right will have the knowledge and the tools. The ones that don't will have traded the former for the latter and won't know it until a vendor changes something that isn't in their control.

There's a simple test for where you are right now: if the AI vendor went offline tomorrow, how much of your organization's capability goes with it? If the answer is uncomfortable, that's not a vendor dependency problem. That's a measurement of what you've already given away.
