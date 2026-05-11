# Breaking the Rewrite Cycle Through Logic Modeling

*February 3, 2017*

Large enterprises spend massive amounts of resources on periodic rewrites of their internal applications to keep up with the changes in the business and advances in technology. While these projects usually introduce some new functionality there's usually a large number of existing business rules that need to be kept intact.

A technology refresh by definition means that you have to rephrase those rules using a new syntax. Often times even collecting the rules is a challenge since most people who originally requested, designed or implemented them have moved on or simply forgot about the details.

Today the only way to solve that is through manual labor. A team of developers needs to meticulously go through the old code, understand what it does and implement the same behavior in the new system. Of course they make mistakes along the way so they also have to go through a long regression testing and bug fixing process. By the time they are finally done it's just about time for another rewrite.

This is clearly inefficient. It's a significant cost for the business that doesn't bring any benefits since the goal is to keep the behavior unchanged. But since there's no easy way around it they accept it as a necessary evil. But is it really necessary?

If you look at the process more closely you will find that the point where it all derails is when the business logic gets lost in the implementation. How does that happen? It starts out with a clear understanding of the business need. Then the technology team translates that to a specific solution that fits into the company's existing infrastructure and systems. And that's it: your business logic is lost in translation.

How do you get around that? You have to capture the business logic in it's original "untranslated" form. This is why we are creating specifications at the start of the project. Unfortunately these documents require a human to process them and cannot be automated.

What if you could replace your specifications with something that can be processed by machines and automate the translation process from pure business rules to the application code? Why not? That's what every compiler is doing. If your language is high-level enough it won't be tied to a specific execution platform.

In order for that to work efficiently though the translation from business logic to an actual technology solution has to be automated. Platform specific optimizations can still be done in the automation process and while generalizing optimization rules is admittedly more involved than just doing one-off tweaks it also produces a fundamentally better system with consistent global optimizations.
