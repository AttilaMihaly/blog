# In-memory or not

*September 7, 2013*

When you start learning a new programming language no one even bothers to state the obvious: data has to be in memory in order to process it. Of course, data doesn't live in memory, so you have to bring it there. You write JDBC code to read from relational databases, XML parsers to process messages or do plain file processing. The standard scheme is:

1. Find the data you need
2. Copy it into memory
3. Do your processing
4. Move the data out of the memory

It's well known that this approach of moving data around is not very efficient, so we find ways to move the logic closer to the data. This makes a lot of sense since logic is almost always smaller than data. The only reason we don't do that all the time is that it's not trivial to transfer logic between different environments. The logic you implement in Java cannot be directly transferred to a relational database. A developer can usually translate certain portions of Java code to SQL logic though, so it is possible, but given the amount of effort and manageability issues involved it's often not practical.

Now let's imagine a platform that looks at the system as a whole including databases, application servers and client applications. Data in this environment doesn't necessarily live in the middle-tier memory and with that processing can also happen in different places. Let's say the programming language of this platform was designed to easily map to most of the current technologies around data management and processing. An application written in this language would be easy to place into a physical environment and compiled into the host system's language.
