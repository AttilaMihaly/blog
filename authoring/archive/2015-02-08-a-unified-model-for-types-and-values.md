# A Unified Model for Types and Values

*February 8, 2015*

In one of my previous posts I presented a model that can describe any kind of logic using a relatively simple graph structure. This was one of the examples:

This diagram is slightly different from the one shown in the previous post. It highlights the types used in the type signature instead of the specific nodes. If you squint a bit you'll probably notice that the overall structure of the sets is exactly the same as the specific nodes. Let's remove the nodes to make it even easier to see the structure:

This is nice but not too surprising. Types allow us to reason about the code without going through all possible values so they are expected to behave consistently with values. Otherwise they would be pretty useless. But if they do behave the same, can we apply the same reasoning techniques for types as we did for values?

## Evaluating types

We have previously shown that expression evaluation corresponds to a graph traversal in this unified model. The fact that the type-level graph looks exactly the same as the value-level graph suggests that we should be able to use the same evaluation techniques to infer types. Let's see if that works, but with a different example to make it more useful. Let's take this expression:

```
1 + 2 == 4
```

This would look something like this in the graph model, and this is how that would look on the type level.

Visually this suggests that we could apply the same evaluation methods that we use to get the return value of an expression to infer its return type. Let's see how that would work here. We should define some reduction rules first:

```
add 1 2 = 3
add Integer Integer = Integer

equals 3 4 = false
equals Integer Integer = Boolean
```

Notice that I defined type-level reduction rules in a very similar way to value-level rules. Now let's do the value-level evaluation:

```
(equals (add 1 2) 4)
(equals 3 4)
false
```

And let's see how that would work for type-inference:

```
(equals (add Integer Integer) Integer)
(equals Integer Integer)
Boolean
```

There you have it: this is a boolean expression! Isn't that great? We used the same exact method to evaluate expressions and infer types. Types behave just like values so you can treat them as such and evaluate them. What's even better is that you can combine them. Take these reduction rules:

```
and true true = true
and false Boolean = false
and Boolean Boolean = Boolean
```

Now let's evaluate this expression: ((false && a) && b) where a, b are boolean variables. Now let's evaluate it:

```
(and (and false Boolean) Boolean)
(and false Boolean)
false
```

What happened here? If we just used traditional type-level reasoning we would have ended up inferring a boolean return type. By adding a mixed value and type reduction rule we were able to get a value back. We wouldn't have been able to do that with a separate type-inferencer unless we had built-in value-specific simplification rules.

> By treating types and values on the same level we can significantly simplify and generalize the tooling around our language and provide much more accurate approximations for the result of an expression.
