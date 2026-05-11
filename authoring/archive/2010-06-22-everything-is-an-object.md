# Everything is an Object

*June 22, 2010*

When I started programming a lot of OOP languages were already available. Everyone knew that the only right way to write code is to treat data and logic as one single block. The promise of OOP was that it will be able to model real world problems very easily, because everything in the real world is an object anyway. Objects have a state and actions that you can perform on them. For example, a car has fuel level as part of its state and you can move it forward, turn left and do a lot of other things with it, but all of these are actions. Simple, right?

Yes, very simple. In fact, it's too simple to be true. Just think about it. How many real objects have you used in your last project? Sure, you have a bunch of POJOs, but that's just data without logic. You probably also have some components that implement the business logic. But do those have any data in them? Of course not, that would be really bad. All the data is safe and sound in the POJOs, where it's meant to be.

We went full circle back to complete separation of data and logic. But why? When did OOP break?

Maybe when we realized that data usually lives outside of memory so encapsulating state and behavior in a single object doesn't really help us?

Or perhaps when it turned out that methods can nicely encapsulate internal state changes but cannot properly model the complex interactions in a real-world system?
