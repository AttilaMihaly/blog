# What is a Unit Type?

*February 22, 2016*

A few days ago I was reading up on basic type theory concepts on Wikipedia when I stumbled upon the relationship between sum types and enumerations. Sum types are also called tagged unions which is a much more meaningful name. They combine multiple types while also assigning a tag to each of them. Enumerations therefore can be considered as a special case of tagged unions where the tags represent each enumeration value and the associated type is a unit type.

A unit type is a type that allows only one value. So enumerations being a special case of tagged unions makes perfect sense. Tags refer to values and the corresponding type contains that single value.

What did not make sense to me though is that functional programming languages treat unit types similar to the void type in imperative languages. Unit is generally used to return something when there's really nothing to return but you cannot return nothing since that would result in an invalid program. When would you not have anything to return? When you have side-effects which is mostly when you do I/O.

This makes I/O work but also contradicts the definition of unit type since a unit type does contain something: it contains exactly one thing. Interestingly most type systems actually make a distinction between Unit and the bottom type which contains no values and therefore considered as the subtype of every other type. So it's like nothing but it's really something. Confusing, right?

To clear things up let's first figure out how many unit types there are. Most programming languages predefine a single one with a single predefined value, but is that right? To answer that let's look at types as sets of values and begin with the two extremes. The bottom type that has no values corresponds to the empty set. The top type which is a super type of all other types corresponds to the set that contains all possible values. It's easy to see that there is one of each of those: the set that contains no values and the set that contains everything.

What about sets that only have one member? Is there only one of those? Of course not. There are exactly as many of those as many values there are: infinite. So it doesn't make sense to talk about THE unit type, we can only talk about A unit type, one of the many.

This makes a unit type suddenly very interesting. It stands between the world of types and values. It's a type but corresponds directly to a value. We can use it as a teleportation device that takes us from one world to the other. For example if an expression only contains variables of unit types we could calculate the result of the expression at compile time (which would also be of a unit type). This gives us a completely generic optimization mechanism that can be applied at different stages of compilation / code generation.
