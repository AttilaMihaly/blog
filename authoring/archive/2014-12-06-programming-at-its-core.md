# Programming at its Core

*December 6, 2014*

## The basic features

When you learn a new programming language you usually don't have to start from scratch since there are some basic features that all programming languages share. Numeric, boolean and string operators, collections and ways to manipulate them are all part of almost every programming language. In fact these features are so core to doing any data processing that they are available outside of programming languages too. SQL for example has the same core features. But even tools like spreadsheets use the same basic operators (just think about formulas).

Of course, programming languages and spreadsheets have a lot of advanced features on top of that. General purpose programming languages can do almost anything from IO to enhanced graphics or speech recognition. Spreadsheets are less capable but still allow you to style your content and add behaviors. So they have much more than just basic data processing operators. When I visualize it in my head I think of something like this:

![Lambda Core Venn Diagram](images/lambda_core_venn.png)

The fact that there is a large overlap suggests that those basic features are crucial for doing anything useful with information. It's easy to see that you cannot do too many useful things without basic calculation capabilities, but let's turn this around and see how much we can do if we only have these basic features available.

## Is that enough?

SQL is a good starting point since it's almost entirely made up of basic data manipulation operators. You cannot read from files, print on the screen or style the output. But even with this limited feature set it is extremely powerful. Relational databases and SQL served our reporting needs for decades and even now when many are questioning the scalability of the relational approach SQL stands strong as a query language. SQL is probably not the future, but there is something unique about these simple data manipulation operators. They allow us to cover a wide range of use-cases without the complexity.

Spreadsheets are actually very similar in that sense. If we ignore the various styling and behavior related features what remains is not too different from SQL. We have formulas that can do math and string operations. We can even aggregate collections and filter them. And just like SQL, spreadsheets are also used extensively for data processing in various different environments even by people without deep technical background. Another example of how a limited set of operators can solve a large variety of problems without being too complex.

## The general purpose

At the other end of the scale we have our general purpose programming languages that have grown in a completely different direction. Although these languages also provide the basic features we discussed but those are completely outweighed by other more complex features like IO, data persistence, caching, display and so on. These are all very important features but they are much closer to the hardware than those basic operations mentioned earlier. This is because the phrase "general purpose" in this case does not refer to the universal meaning of being able to use it for anything. It only means you can do whatever a computer can do. And to achieve that you have to mirror the capabilities of a computer in the programming language.

This has caused a shift towards concepts that don't exist in real-life and made programming languages less useful for solving real-world problems. I know this sounds like an attack on our beloved programming languages but I don't see it that way. I think this was a completely natural process and not necessarily a bad one. And if you don't think that's true just ask yourself these questions:

Can non-technical people solve problems with your favorite programming language?
Can they do the same with Excel?
Is it easy for you to translate those Excel sheets into working applications?

If you are still skeptical just think about what the most frequently used introductory example in programming language tutorials is. Yes, it's Hello World! And what real-world problem does that solve? The very realistic problem of printing an array of characters on a computer display …

Of course it wouldn't make sense to do something complex for an introduction but even adding two numbers is more useful than that in the real-world. Unless of course your only goal is to make the computer do something.

## The functional way

There is a subset of general purpose programming languages where this shift wasn't so significant though. Functional programming languages are declarative so they talk less about the how and much more about the what which kept them closer to real-life problems. They don't like side-effects so printing characters is not trivial which means that Hello World isn't trivial either. In fact many of those tutorials begin with simple numeric operations instead of Hello World!

Not too surprisingly these languages tend to be better for evaluating expressions and also manipulating collections. On the other hand imperative programming languages like Java make it painful to do the simplest operations on collections. Another example of how the focus shifted away from real-world problems and made those languages less useful in that area.

Unfortunately being "general purpose" functional programming languages also make an effort to support hardware related features like IO. Doing IO without side effects is almost impossible so people invented mind-bending concepts like monads that are very elegant but probably not as easy to use as imperative APIs.

## The middle ground

Based on the above it seems that we could define a relatively small declarative language that sits in the intersection of general purpose programming languages, query languages and some productivity tools like spreadsheets. This language would be able to cover a wide range of real-world problems while being simple enough to be conceivable by non-technical people.

This is my goal with the creation of Lambda Core.

![Lambda Core](images/lambda_core.png)
