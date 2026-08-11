---
name: draft
description: Start a new blog post from the authoring/README.md backlog. Use when the user says "/draft <topic>", wants to start writing a new post, or picks a topic to move from Backlog to In progress.
---

# Draft

Companion to [publish](../publish/SKILL.md). Handles the front of the pipeline:
turning a backlog line in `authoring/README.md` into a scaffolded draft directory.

Takes one argument: a topic. It may be an exact backlog line (e.g. "Verifiable
Knowledge") or a new topic not yet in the backlog.

## Steps

1. **Find or add the topic.** Look for a matching bullet under `# Backlog` in
   `authoring/README.md` (case-insensitive, fuzzy match on wording). If found,
   remove it from Backlog. If the topic isn't in the backlog at all, that's fine —
   just proceed with it as a new topic.

2. **Move it to In progress.** Add `- <topic title>` under `# In progress` in
   `authoring/README.md`. Keep it there until the user explicitly says the draft
   is complete and ready to publish — moving to `# Completed` is `publish`'s job,
   not this skill's.

3. **Allocate the next sequence number.** Look at existing `authoring/<NN>-<slug>/`
   directories (ignore `authoring/archive/`) and pick the next integer, zero-padded
   to 2 digits.

4. **Create the directory and stub article.** `authoring/<NN>-<slug>/article.md`,
   where `<slug>` is a short kebab-case version of the topic. Use this frontmatter
   shape (the contract `scripts/frontmatter.ts` expects):
   ```
   ---
   title: "<Topic Title>"
   description: ""
   tags: []
   status: draft
   ---

   ```
   Leave `description` blank and `status: draft` — both get filled in as the
   piece develops. `dek` and `kicker` are omitted; they default to `description`
   and `"Essay"` at publish time if never set.

5. **Report back.** Tell the user the directory that was created and that the
   topic is now listed under In progress. Don't write article body content
   unprompted — wait for the author to actually start drafting, unless they asked
   you to draft the piece in this same request.
