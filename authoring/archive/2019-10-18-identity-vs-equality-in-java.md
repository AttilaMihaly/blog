# Identity vs. Equality in Java

*October 18, 2019*

**Key Takeaways**

- Do not include ID fields in your Java domain classes.
- Use all fields in your `equals()` and `hashCode()` implementation.

## Explanation

I've seen a lot of Java code where developers implement `equals()` and `hashCode()` in terms of an ID field or a subset of fields that form a composite key. It's done so frequently that it became a pattern when in my opinion it is actually an **anti-pattern**. To understand why it's an anti-pattern we have to differentiate identity from equality:

### Identity

When we talk about identity in computer science we usually think of something that uniquely identifies a person or thing. In Java we use references to uniquely identify objects. This is also called referential equality (yes, the naming is confusing). You use == to compare the identities of two objects.

> Notice that identity is something external. A reference is not part of the object it simply points to the object. Another important point is identity doesn't change over time: *As I get older I'm going through a lot of changes but I'm still the same person.*

### Equality

Equality refers to two objects being the same. Two object being equal doesn't necessarily mean that they are the same object. In Java we use the equals() method to check if two objects are equal. This is also called structural equality.

> Equality can always be decided by looking at the object only. You don't need any external information to decide equality. Equality can change over time: *I'm not equal to the person that I was 20 years ago.*

## Real-world objects

When you are modeling real-world objects you usually have some kind of ID to refer to it. For example you might have a simple product definition with an ID and a price:

```java
public class Product {
  private final String id;
  private BigDecimal price;
  // rest of the code is omitted for brevity
}
```

Now you need a way to check if two products are equal. So you go ahead and implement an equals method:

```java
public boolean equals(Object o) {
  if (o == this) return true;
  if (o == null || this.getClass() != o.getClass())
    return false;
  Product that = (Product)o;
  return this.id.equals(that.id);
}
```

We used the id field as most java developers would but is this right? Let's test it:

```java
new Product("IBM", 142.05)
  .equals(new Product("IBM", 110.03)) // true
```

I think we can agree that we could potentially loose a lot of money if we relied on this equals implementation to drive our trading decisions. So what happened here?

What we really wanted is to check if we are referring to the same product. But referential equality if not customizable in Java, it's always based on memory address and we cannot change that. If we could we would make it use the id field, but we cannot so we fall back to doing it in the equals which is wrong.

The other thing we seem to have forgotten is that identity is external. It's not a property of the object itself. It's an external reference so it should even be part of the object. How can we achieve that in Java? We can simply use a Map:

```java
Map<String, Product> products = ...
products.get("IBM") == products.get("IBM") // true
products.get("IBM") == products.get("459200101") // true
```

As you can see we get what we expect. We can even use different IDs to refer to the same product if our Map has all the various product ID types. So referential equality works as expected, now we can move on to fix our equals:

```java
public class Product {
  // id is not part of the object any more
  private BigDecimal price;
  // equals is implemented in terms of all the fields
  public boolean equals(Object o) {
    if (o == this) return true;
    if (o == null || this.getClass() != o.getClass())
      return false;
    Product that = (Product)o;
    return this.price.compareTo(that.price) == 0;
  }
}
```

And this way we get and `equals()` that doesn't directly lead to bankruptcy:

```java
new Product(142.05).equals(new Product(110.03)) // false
```

## To sum up

- Do not include ID fields in your Java domain classes.
- Use all fields in your `equals()` and `hashCode()` implementation.
