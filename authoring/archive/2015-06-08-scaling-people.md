# Scaling People

*June 8, 2015*

Complexity in our software systems is growing and the only solution we seem to have is to throw more developers at the problem. Universities are mass producing developers but they cannot keep up with the demand. Even if they could though we would still have a difficulty with coordinating the masses of developers. Productivity in large teams suffers because there is a limit to how many people can work together efficiently. Building smaller teams might alleviate some of those issues but then coordinating those smaller teams becomes an issue. It seems that **people just don't scale horizontally** beyond a certain limit.

So can we **scale them vertically** instead? Can we get them to produce more code? They probably are already doing their best so just pushing them to do more wouldn't be too effective. There is also a physical limit to how fast they can type so we have to do something more sophisticated. When people couldn't do certain tasks fast enough in a factory we use machines to do the job and it usually works pretty well. Can we use the same approach to make software development more productive?

How do we tell if a piece of code was written by a senior or a junior programmer? We look for patterns. The more patterns there are in the code the better the programmer is. Because they know "how things should be done". They read enough articles, they have seen enough code and experienced real-world issues that taught them how to write better code. They also know that other people will read their code so they shouldn't do anything out of the ordinary. The simpler the better. Doesn't that sound like the ideal thing to automate?

It is ideal. Of course it's more complex than just producing the same light bulb every time but it's doable. Ask a senior developer how they implement a POJO. What are the things they pay attention to? What are the things they avoid? Then implement some code that writes the code for them. Or better yet ask them to write the code generator.

Will that really improve productivity? A code generator can certainly "type" faster. It'll produce thousands of lines in milliseconds. It will never make any mistake regardless of the size of the problem. The only one who can make a mistake is the programmer who implemented the code generator. But even if he or she made a mistake it will be very easy to find since it will be all over the place. The code generator will make the same mistake everywhere. Not like the mistakes real programmers do which are random so usually very hard to find. Also, any enhancement in the code generator will be applied to all the code that it has produced in the past and will be producing in the future, not just the given occurrence.

People are not very scalable by nature but with a bit of help they can do much more and concentrate on interesting tasks instead of mindless typing.
