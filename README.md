# Discord bots
This is my collection of small discord bots made using Javascipt.

## About Me
### Why am I making this?
I enjoyed making a few test bots for random scenarios to mess around and try stuff out.

### When do I work on this?
I used to work on these more but now i've moved over to making bigger bots which I put in seperate repositories.

## What is it exactly?
### Reply bot
A bot that replies to your messages based on preset conditions, it can check for the whole text, part of it, case sensitive or not.

### Word learner bot
A bot I made with a friend, he made his in python, I made mine in javascript. You can give it sets of words and translations/definitions and it will go over them asking them to you, you can also select some older sets.

### Dating bot
A bot with which you can queue up and when a second person queues up you will be put together in a channel with no access of modorators. In case a moderator is needed you and a moderator will be put in a second channel where a bot will clone all the messages from the original channel.

### Timer bot
A bot that will edit the same message and ping you to tell you to climb some stairs. Shows time since last climb and the time to next climb. On startup it will check for the next hour and use that as the first stairclimb.

## How is it made?
### Language
It is almost all written in Javascipt using the [Discord.js](https://discord.js.org/) library.

### Data storage
All data stored in these projects is stored in generic text files formatted as json and are read at startup of the applications.
