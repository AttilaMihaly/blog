# Introducing Continuous Programming

*February 12, 2017*

As software developers we continuously strive to speed up our delivery pipeline to cope with the ever increasing demand for software. Continuous Integration and Delivery are essential tools for that and by now they became an industry wide standard. When it comes to coding though we still edit text files and then hand it to a compiler or interpreter to see whether it does what we expect it to do. This process in not continuous at all and it creates a lot of friction that goes well beyond our local development environment.

Of course we have a lot of other things to worry about so why would we even try to change something that has worked for many-many decades and is completely natural to all of us? In my opinion we reached a local optimum with our delivery pipelines that cannot be further improved without rethinking the way we interact with our development environment.

> We need to make our programming languages continuous down to their core and interact with our compilers and each other using atomic changes instead of monolithic snapshots of our entire code base. This will have a profound impact on everything we do that relates to changes. Which is pretty much everything we do …

Relational databases have been doing this for ages. If we want to update the schema we tell the database what exactly needs to be changed not what it should look like when the change is done. As a result the database can evolve without ever going down.
