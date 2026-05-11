# Let's Face Complexity

*June 22, 2010*

![Cookie Monster](images/cookie-monster.jpg)

Probably the biggest issue in modern software development is complexity. We struggle to find ways to make our systems simpler and easier to manage. In this war, we attack on all fields: we invent new libraries, frameworks, methodologies, tools, standards. Are we winning? I don't think so. Systems are getting more and more heterogeneous and hard to understand. Complexity is like a monster from an old sci-fi, it eats our missiles and grows stronger.

So what do we do then? I think we should stop shooting at it and let it starve to death.

What does that mean in practice? You have to accept that your system will be complex to a certain level. That's the first step. Some developers already fail at this point. They say that you should only solve something if it becomes an issue. Those people introduced the term "quick and dirty solution", which for me is the equivalent of "no solution", or sometimes "one more issue".

Once you accepted complexity, you can start to find ways to deal with it. One thing people usually try to do is to hide it. If complexity is a monster, hiding it in your wardrobe, doesn't seem to be a very good idea. You won't see it for most of the day, but when you need to get something from the wardrobe, you might get hurt. Just think of Hibernate or JAXB. Most of the time, they do the "magic", but sometimes, you have to do things that are not supported out-of-the-box. This is the time when things can get really tough. You cannot really debug these systems, they are too generic, plus they use reflection, and all of a sudden, the "magic" becomes nightmare.

What makes those systems that complicated? We have a lot of different tools in OOP to support code reuse, but still, these systems have to go beyond that, and use reflection on objects that have a well defined static structure. Why? Because they want to decrease complexity by reusing the same logic to handle all the properties of an object. This is beyond the capabilities of OOP. You can apply logic to a set of objects, but not to a set of properties. If you really wanted to avoid reflection, you could try to replace your properties with a set of named objects, to be able to traverse them easily, but it would have the same disadvantages as reflection: no compile time checks, performance degradation and debugging difficulties.

Is there nothing we could do about this? Let's see… We want to apply the same logic for all properties, but we don't want to do it at runtime. Could we simply copy-paste the logic for all properties? That would work: proper compile time checks, easy debugging. But nooo…., we are programmers, we shouldn't copy-paste, we should write loops. But loops can only be used at runtime, which is too late. Hmmm….

![Fixing Server](images/fixing-server.jpg)

What if we let the application write the code? We could have loops to write the same logic for each property, and then compile that code. This is it! This is Code Generation!
