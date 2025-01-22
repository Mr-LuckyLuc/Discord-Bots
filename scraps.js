const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, Message } = require('discord.js');

//response saver
client.on('messageCreate', (msg) => {
    const reactions = {
        'hello': 'hello '+msg.author.username,

    }
    if(msg.author.bot === false) {
        if(msg.content.startsWith('tb! ')) {
            if(msg.content.startsWith('add reaction:')){
                const message = msg.content;
                const reaction = message.slice(17);
                const index = message.findIndex(';');
                const key = reaction.slice(0,index);
                const value = reaction.slice(index);
                reactions[key] = value;
            }
        }
        for(key in reactions){
            if(msg.content === key){
                msg.channel.send(reactions[key]);
            }
        }
    }
})




//hello answer
client.on('messageCreate', (msg) => {
    if(msg.author.bot === false) {
        if(msg.content.toLowerCase() === 'hello') {
            msg.channel.send('hello' + ' '  + msg.author.username); //reply hello word msg with senders name
        }
    }
})




//file management
const fs = require('fs');
const querystring = require('querystring');

const obj = {
    key1: "value1",
    key2: "value2",
}
 
fs.writeFile("test.txt", JSON.stringify(obj), (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('written');
    };
});
fs.readFile("test.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        console.log(JSON.parse(data));
    };
});
fs.unlink();
fs.rename();




//special reactions
if(1){
}else if(key.startsWith('<a>') && key.endsWith('<a>')){
    toReplaceReactions[key] = value;
    fs.writeFile("toReplaceReactions.txt", JSON.stringify(toReplaceReactions), (err) => {
        if(err){
            console.log(err);
        }else{
            console.log('toReplace written');
        };
    });
}





//textchannel name collector
const guildInfo = client.guilds.cache.map(guild => guild.channels.cache.map(channel => {
    if(channel.type === 0){
        return channel.name
    }
}));
const channelNames = [];
guildInfo.forEach(guild => {
    guild.forEach(channelName => {
        if(!(channelName === undefined)){
            channelNames.push(channelName);
        }
    })
});

//aaaaaaaaahhhhhhhhhhh





    //if (guild.available) {
    //    const members = guild.memberCount;
    //    console.log(members);
    //}