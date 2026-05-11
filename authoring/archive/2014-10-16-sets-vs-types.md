# Sets vs Types

*October 16, 2014*

Sets and types are very closely related concepts but not exactly the same. They are both used to group things but while sets can include **all kinds of different things** types usually include only things that are **similar in some way**. This similarity allows us to handle all members uniformly and apply operations without knowing the exact value of a variable.

Looking at the diagram above types look very organized and clean while sets look like a generalization that isn't very useful from a computational perspective. There is a fundamental property of sets though that types tend to ignore. Sets are defined by a **membership relation** that tells you exactly which values are members of the set and which ones are not. Although types do inherit this membership property the relation is usually defined indirectly by labeling each value as members of a certain type. The membership relation is not attached to the type itself instead it is attached to the value.

## The Conflict

This may seem like a subtle difference but it means that **sets** can be **defined after values** have been created while **types** have to be **defined before any values** are created. Think about what that means in terms of modeling real world problems. When a human tries to solve a problem it observes things, finds common properties and then categorizes them into manageable groups. This process maps naturally to sets. Types on the other hand have to be predefined and then each thing needs to get a label just to be visible. You basically have to model a world before anything was in it. Does that sound feasible to you?

## The First Stab

The first thing to notice that the membership relation can be expressed as a function returning a boolean value. In other words it's a predicate or a filter. Taking an OOP example we could add an isMember(value) method to each class that would decide if a given value is a member of that type. Something like this:

```scala
trait MySet {
    def isMember (value : Any) : Boolean
}
```

Notice that we accept anything as an argument to make it more set-like. Which is fine unless you want to actually implement this method in which case it will be very difficult to say anything meaningful given that there are not too many useful operations on Any. We need to give it a more specific type so at this point we need to decide what we are dealing with. So let's put the example in context. Say we want to do something with vehicles:

```scala
trait Vehicle {
    def topSpeedMph : Int
}
```

Now that we have vehicles let's see how we can create some useful subtypes. Let's say we want to say something specific about supersonic vehicles. For example: does it use an afterburner to reach supersonic speeds?

```scala
trait SupersonicVehicle extends Vehicle {
    def usingAfterburner : Boolean
}
```

## The Lie

From an OOP perspective this definition is complete. It tells you everything you need to know. But is that really the case? Do we know which vehicles are supersonic? Well in the real world this would be any vehicle with a top speed above the speed of sound. For us programmers it's everything that we claim to be supersonic:

```scala
val myNotSoSupersonicCar =
    new SupersonicVehicle { // this is a lie
        def topSpeedMph = 160 // this is true
        def usingAfterburner = true // ok it needs an afterburner
    }
```

## Getting Closer

The real issue is not that we can lie but that there's no way to express our intention. We are missing the membership relation. If we want to get it back we need a membership relation assigned to the class itself. Given that Scala is not a dependently-typed PL we cannot express value level constraints with the type-system. The best thing we can do is pattern-matching. Fortunately we can at least nicely attach them to our types using Extractor objects:

```scala
object SupersonicVehicle {
    // a vehicle is supersonic if its top speed is
    def unapply (vehicle : Vehicle) : Option[SupersonicVehicle] =
        // above the speed of sound
        if (vehicle.topSpeedMph > 768) Some(???) else None
}
```

Now we have the best of both worlds:

- we can call specific methods on supersonic vehicles
- and be sure that they are in fact supersonic

```scala
// given a bunch of vehicles
val vehicles : Set[Vehicle] = ???

// find the max speed of supersonic vehicles that don't use an afterburner
vehicles.collect {case SupersonicVehicle(v) => v}
    .filterNot {_.usingAfterburner}
    .map {_.topSpeedMph}
    .max
```

## Conclusion

Mainstream programming languages give us a lot of useful tools but sometimes going back to the basics can generate new ideas that we can use to make our code better. Hopefully I was able to demonstrate that adding a membership function and looking at our types more like sets in the mathematical sense can provide value. If nothing more it helps us reason about certain problem domains more naturally.
