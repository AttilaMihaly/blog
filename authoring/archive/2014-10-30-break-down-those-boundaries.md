# Break Down Those Boundaries!

*October 30, 2014*

As software developers we are constantly pushing the limits of our tooling. We are also very creative so when what we have is not sufficient we simply invent something completely new. We created hundreds of programming languages and we still haven't stopped. We extended relational database as far as we could and now we are moving on to NoSQL. We are always looking for new problems to tackle and we are never looking back.

While this creates a very lively and exciting environment it also has some drawbacks. Our industry became incredibly fragmented and difficult to navigate. Integration is incredibly costly yet it's almost completely ignored. We inadvertently built up a bunch of walls and instead of breaking them down we simply move on to a clean area. Many of us though are stuck behind the walls of language barriers, object-relational impedance mismatches, library version differences and custom product features struggling every day to get things done. Is that really the best we can do? Hopefully not …

## Unification

JVM based languages already proved that you can build something completely new on an existing platform with the added benefit of easy integration. Scala also proved that even things like object-oriented and functional programming can be used together efficiently in a single language. While the OOP and FP camps were going neck and neck to prove that one of them is superior Scala emerged to show that the combination is more powerful than either of them separately. It also proved that you don't need a different (scripting) language for small tasks if your main language has a nice syntax and easy-to-use APIs.

My point here is not how great Scala is though. My point is that **the power of unification** severely underestimated. You don't have to invent something completely new to make things better. Building on existing ideas/tools/technologies is not a crime. It's actually a good thing.

## The Boundaries

In the next couple of posts I'll try to identify and break down some of the boundaries that keep us from solving real problems. Some of those boundaries are so basic and deeply ingrained in us that breaking them will probably sound crazy but I promise it won't be a waste of your time. Before I go into details let me just whet your appetite with a list of things I will cover and some of the things I hope to achieve.

### Logic and Data are fundamentally the same

Once you accept the above you can conclude a few more interesting things:

- Data is portable so **Logic becomes portable**
  - Think about calculations pushed from Java to SQL or .Net to Java.
  - What about client-side validation? That's logic too. What about pushing it from Java to JavaScript?
- Logic can be executed so you can **execute your Data**
  - Say you have a bunch of calculated columns in a result set. Normally you would send all that data to the client.
  - Now you can send only the base columns and calculations back and let the client execute the calculations. This could save a lot of bandwidth.
  - You can also let the user update the base data and have it recalculate on the fly!

### Values are special cases of Types

Types are sets of values. A value can be thought of as small type that has only one member (the value itself).

- There is no distinction between Type inference and Evaluation. Code optimization simply becomes type evaluation.
- Function overloads can go down to the value level and used as a replacement for pattern-matching.
- Homogeneous type-system that fits nicely with "Data as Logic".
