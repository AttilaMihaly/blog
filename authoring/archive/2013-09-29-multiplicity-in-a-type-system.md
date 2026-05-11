# Multiplicity in a Type System

*September 29, 2013*

## Collections and other types

The importance of type-safety in programming languages is well-known. It helps the programmer by enforcing some basic rules that would make more harm than good to violate. A type system basically tells you what you can and cannot do with a certain variable. Almost every programming language has some kind of basic types such as integers, floats and strings. You can do all kinds of useful calculations with these, but it doesn't take long until you need some kind of collection to store a bunch of these values. Most object-oriented languages offer many collection classes with different properties for this purpose (List, Set, Map in Java). Notice that collections are created using existing language features here, so things get a little complicated for the type-checker because you are now working with a collection class and by default, the type-checker doesn't know anything about what's inside. Generic types solve this by adding type information about the elements of the collection making it possible for the compiler to retain the type information. It worths mentioning that even though they are heavily used for implementing collections generic types are not collection specific. Just like classes, this is a general-purpose language feature.

Some programming languages also have specialized classes to differentiate optional vs mandatory values (Option in Scala). Let's take a step back here and see how these things are related to each other:

```
val a1: Int = 1
val a2: List[Int] = List(1, 2)
val a3: Option[Int] = Some(3)
```

They are all related to integer numbers, right? What is different then?

## Multiplicity

Yes, these values are of the same type, but have different multiplicities. The first one, has a multiplicity of exactly one. The second one is zero or many. And finally, the last one is zero or one. All of them can be described with a simple (minimum, maximum) occurrence constraint pair.

Now imagine a programming language that treats multiplicity just like types: every expression has a multiplicity. How would that change the above declarations?

```
val a1: Int<1..1> = 1
val a2: Int<0..*> = (1, 2)
val a3: Int<0..1> = 3
```

Notice how the emphasis shifted from the container type to the actual value type and how clearly you can see the similarities among these variables. It's much easier to reason about their compatibility as well, since we moved from incompatible type declarations to equivalent types with different multiplicities. Now we only need to use a simple rule to check the compatibility of their multiplicities:

> Multiplicity M2 is compatible with M1 iff the following formula holds:
> M1min <= M2min <= M2max <= M1max

Based on this rule, here is the compatibility matrix of the above values:

| to \ from | a1 | a2 | a3 |
|-----------|----|----|-----|
| a1        | –  | no | no  |
| a2        | yes| –  | yes |
| a3        | yes| no | –   |

## Functions that change multiplicity

Let's begin with a simple Scala code snippet. This is a generic sum function:

```scala
def sum[T](in: Seq[T]): Option[T]
```

*Notice that the return type is Option because the input might be empty, which means that the sum could be None.*

We can replace the Seq and Option types with the corresponding multiplicity declarations.

```
def sum[T](in: T<0..*>): T<0..1>
```

*Notice that the function only changes the upper bound of the multiplicity. The lower bound remains zero after applying the function.*

This is nice, but what if the input is known to have at least one value? In other words, it's a non-empty collection.

```
def sum[T](in: T<1..*>): T<1..1>
```

*This time the lower bound is 1, so the multiplicity of the returned value is exactly 1. It will always return a value.*

It seems that we need multiplicity variables to solve this:

```
def sum[T]<a: 0..1>(in: T<a..*>):
  T<(a min 1)..1>
```

*This will work for both use cases.*

## Conclusion

Scala simulates the above features very nicely using its enhanced features and gets very close to what a language with specific knowledge about multiplicity could achieve. Without specific support for multiplicity calculations though everything has to be expressed using type constraints which makes the solution very complex. So, why would you not build multiplicity into the programming language instead? It's at the very core of data modeling and you have to deal with it anyway through the use of collections or optional values, so why not make it explicit?
