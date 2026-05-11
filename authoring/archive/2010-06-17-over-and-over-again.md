# Over and over again ...

*June 17, 2010*

![Software Developer](images/software_developer.jpg)

Over and over again … Probably this is not the best title for a first post, but looking back on my last ten years of software development career, these words were always on my mind.

I'm not saying that I did the same thing repeatedly. In fact, I never did the same thing twice. It was a continuous evolution. Each time I created something new, I tried to keep the good things and change those that didn't work out well. That's why companies measure experience in years, because each developer goes through these steps and over time they learn how to do things right.

Unfortunately, this takes long, and since we haven't invented how to transfer a person's knowledge into someone else's mind yet, everyone has to go through it. But does it have to be like that? Couldn't we somehow capture the expertise these people gained over the years? I believe we could. It's just that we don't have the appropriate tools yet.

What do you as a developer do when you begin to implement something new? You probably take the problem that is usually specified in a domain specific language, then try to build up an abstract model and finally start coding it. What I was referring to as expertise was actually software development expertise. This maps to the second phase of the process: writing the actual code based on the abstract model. In contrast to the first phase which requires domain specific knowledge, the second phase only requires knowledge that is specific to software development and all decisions in this phase should be made based on technical requirements which are completely domain neutral.

![Chemicals](images/chemicals.jpg)

This is very important. I saw many cases when companies failed to understand that there is nothing special in any of the problem domains that would require software developers to replace their general purpose tools to something domain specific. When I was working for a company developing tools for chemists they even invented their own application server. It was a ridiculous attempt, no wonder they failed. But companies do not stop here, I even saw a financial company develop its own programming language. In both of these cases companies believed that they could simplify the development process by bringing the application's language closer to the problem domain. Unfortunately it did not work out well, because over time the new language became just as complex as the old ones and for the worse it was now even monolithic.

![Money](images/money.jpg)

But these companies are not completely stupid. They did correctly realize that something needed to be changed in their software development practice because they spent too much time on technical problems. They were also right about the need for bringing the solution closer to the domain. The only thing they missed is that the solution is not the code itself, the solution is the model that is built during the analysis and design phase. Of course you cannot "run" the model to solve the domain problem, you have to build applications based on the model and run those instead. But building the applications from the model is a purely technical process. You will have to answer questions like: should this be implemented as a service method or a stored procedure in the database; or should this column be nullable in the database. The model should be detailed enough to be able to answer these questions by adding some external information such as the available hardware or performance requirements.

![Computer Servers](images/computer-servers.jpg)
