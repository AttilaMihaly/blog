# Blog Workflow Guidelines

## Status Tracking

Topics are tracked in `README.md` with three sections: **Backlog**, **In progress**, and **Completed**.

- When a conversation begins about a backlog topic, move it to **In progress** immediately.
- Keep it in **In progress** until the user explicitly says it is complete, then move it to **Completed**.

## Directory Setup

When a topic moves to **In progress**, create a dedicated directory for it under `context/blog/`:

- Name format: `<sequence_number>-<slug>` where the sequence number is the next available integer (1-based, zero-padded to 2 digits if needed), and the slug is a short kebab-case version of the topic title.
- Example: `01-who-owns-your-knowledge/`
- Store all article content for that topic inside its directory.

## Article Format

- Write all articles as Markdown (`.md`) by default unless the user specifies otherwise.
- The main article file should be `article.md` inside the topic directory.
