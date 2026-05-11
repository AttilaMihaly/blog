# A Unified Model for Data and Logic

*January 17, 2015*

## The RDF model

When I was looking for a flexible data model to use in Lambda Core RDF seemed like a good starting point. The model of RDF is elegantly simple yet very descriptive. The exact combination I needed. The simplest way to look at it is a directed, labeled graph. Just like the sentences in a paragraph an RDF graph can be broken down into triples. A triple is a combination of two nodes and an edge between them: a subject, a predicate and an object.

This is a simple structure that allows us to build a knowledge base using simple statements like "My first name is Attila" or "I have a pet called Lucky". These would translate to triples (#me, hasFirstName, "Attila"), (#me, hasPet, #lucky), (#lucky, hasName, "Lucky"). Combining these triples produces the RDF graph.

## Leak in the model

This structure can describe a variety of problem domains very naturally so it's an ideal knowledge representation format. There's almost nothing in the real-world that wouldn't have a trivial mapping to RDF. But of course as most abstractions RDF also makes compromises to achieve this level of simplicity. While triples nicely cover the traditional statements that relate two things to each other there are statements that relate more then two things. For example the statement "My first name is Attila" directly maps to a triple but the statement "My nickname is Ozmium at WordPress" relates 3 entities. This diagram shows the difference:

Since predicates can only refer to nodes you cannot properly handle these situation. Of course there are ways to get around that but that involves creating nodes that represent a triple which makes the model incredibly complex. So the abstraction is leaky…

## Fixing the leak

Triples allow us to have one edge and two nodes but we need one edge and many nodes. In other words we need more than 3 things. Tuples can relate an unlimited number of things so let's begin by lifting the 3-tuple limitation. Let's also put the edge to the front for consistency since now the number of nodes can be more than two so the infix notation won't always work. The two sentences above could then be written something like this:

```
(hasFirstName, Me, "Attila")
(hasNickname, Me, WordPress, "Ozmium")
```

Now let's leave off the punctuation and prepend the target node of the relation with an equals sign since that's the value we get:

```
hasFirstName Me = "Attila"
hasNickname Me WordPress = "Ozmium"
```

If you know Haskell this might look familiar. These are cases of a pattern match which is the main mechanism to implement functions in Haskell. Let's extend the definition by adding the type signature and some additional cases.

```haskell
hasFirstName :: Person -> String
hasFirstName Me  = "Attila"
hasFirstName Him = "John"

hasNickname :: Person -> Site -> String
hasNickname Me  WordPress = "Ozmium"
hasNickname Me  GitHub    = "ozmi"
hasNickname Him GitHub    = "xyz"
```

Now let's see how this would translate back to the extended RDF model:

Functions in this model are mappings between named sets that correspond to the types in the Haskell function signatures. The resources (subjects and objects) that we relate are members of these sets and edges run between them in the same direction as the arrows in the Haskell type signatures. A function can be thought of as the combination of all the edges that use the same label and the specific edges directly correspond to the cases in the function body.

So the extended RDF model has a nice mapping to idiomatic Haskell code. Even the language doesn't really matter as long as you have pattern matching so Scala would work just as well. What's more important though is that by switching from triples to tuples we have opened up the model for a whole new set of problem domains.

## Applying the model to other domains

One thing that RDF cannot do using triples is express basic binary operations. You can relate one number to the other but binary operations (like addition, subtraction, multiplication or division) relate 3 things: the two arguments and the result. With the extended RDF model we can represent these as well. Let's look at these simple equations first:

```
1 + 2 = 3
3 / 6 = 0.5
¬true = false
¬false = true
true ∧ true = true
true ∧ false = false
```

This is how these would look like in Haskell:

```haskell
add :: Integer -> Integer -> Integer
add 1 2 = 3

divide :: Integer -> Integer -> Decimal
divide 3 6 = 0.5

not :: Boolean -> Boolean
not true = false
not false = true

and :: Boolean -> Boolean -> Boolean
and true true = true
and true false = false
```

Of course these function are incomplete. For example to make the `add` function generally applicable we would have to list all combinations of 2 integers which is not practical to say the least (it wouldn't even be possible if we consider the set of integers to be infinite). But don't worry, this is a conceptual model so we don't actually need to implement the functions. All we want to use this model for is to reason about the application data and logic.

## The unified model

It's easy to see that this model can describe any pure functions. You can simply turn all possible inputs and outputs of a function into nodes and connect them using directed edges as shown previously with various examples. Now imagine that you did that for all the functions (including ones that are built into the language) in your system. This would create an infinitely large graph that encapsulates both the data and the logic in your system.

Once you have this massive graph you can provide a simple interpretation to a pure functional programming language:

- An expression evaluation becomes equivalent to a specific graph traversal.
- You can pass in any nodes to a function and get another node back based on the traversal defined by the expression in the function body.
- Defining a new function corresponds to creating new edges based on the above traversals.

There are many other useful abstractions that we can deduce from this model but those will be covered in other posts. Let's conclude this one with a summary of what we achieved:

> Simply by extending the RDF model from triples to tuples we got a powerful model that unifies data with logic and provides a simple interpretation of purely functional languages.
