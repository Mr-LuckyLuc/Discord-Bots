require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file
const fs = require('fs');
const querystring = require('querystring');
const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, Guild } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildIntegrations], partials: [Partials.GuildMember, Partials.User, Partials.Channel], autoReconnect: true });

let skipOnlineMessage = [];
fs.readFile("skipOnlineMessage.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        skipOnlineMessage = data.split(",");
    };
});

let includingReactions = {};
fs.readFile("includingReactions.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        includingReactions = JSON.parse(data);
    };
});
let caseInsensitiveReactions = {};
fs.readFile("caseInsensitiveReactions.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        caseInsensitiveReactions = JSON.parse(data);
    };
});
let includingCaseInsensitiveReactions = {};
fs.readFile("includingCaseInsensitiveReactions.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        includingCaseInsensitiveReactions = JSON.parse(data);
    };
});
let normalReactions = {};
fs.readFile("normalReactions.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        normalReactions = JSON.parse(data);
    };
});

client.login(process.env.TOKEN);

client.on("ready", (msg) =>{
    const mainChannel = client.guilds.cache.map(guild => guild.systemChannelId);
    console.log("BOT IS ONLINE"); //msg when bot is online
    mainChannel.forEach(id => {
        console.log(!skipOnlineMessage.includes(id))
        if (!skipOnlineMessage.includes(id)) {
            const tempChannel = client.channels.fetch(id)
            .then(tempChannel => {
                tempChannel.send('reaction bot online.');
            }) 
        }
    });
});
client.on('messageCreate', (msg) => {
    if(!msg.author.bot) {
        console.log('message');
        for(key in includingReactions){
            if(msg.content.includes(key)){
                msg.channel.send(includingReactions[key]);
            }
        }
        for(key in caseInsensitiveReactions){
            if(msg.content.toLowerCase() === key.toLowerCase()){
                msg.channel.send(caseInsensitiveReactions[key]);
            }
        }
        for(key in includingCaseInsensitiveReactions){
            if(msg.content.toLowerCase().includes(key.toLowerCase())){
                msg.channel.send(includingCaseInsensitiveReactions[key]);
            }
        }
        for(key in normalReactions){
            if(msg.content === key){
                msg.channel.send(normalReactions[key]);
            }
        }
        if(msg.content.startsWith('tb! ')) {
            console.log('recognised')
            if(msg.content.startsWith('add reaction: ', 4)){ //add reaction loop
                if(msg.content.includes(';')){
                    const message = msg.content;
                    const index = message.indexOf(';');
                    let key = message.slice(18,index);
                    const value = message.slice(index+1);
                    if(key.startsWith('<i>') && key.endsWith('<i>')) {
                        key = key.slice(3,-3);
                        includingReactions[key] = value;
                        fs.writeFile("includingReactions.txt", JSON.stringify(includingReactions), (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                console.log('include written');
                            };
                        });
                    }else if(key.startsWith('<c>') && key.endsWith('<c>')){
                        key = key.slice(3,-3);
                        caseInsensitiveReactions[key] = value;
                        fs.writeFile("caseInsensitiveReactions.txt", JSON.stringify(caseInsensitiveReactions), (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                console.log('case insensitive written');
                            };
                        });
                    }else if(key.startsWith('<ic>') && key.endsWith('<ic>')){
                        key = key.slice(4,-4);
                        includingCaseInsensitiveReactions[key] = value;
                        fs.writeFile("includingCaseInsensitiveReactions.txt", JSON.stringify(includingCaseInsensitiveReactions), (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                console.log('including case insensitive written');
                            };
                        });
                    }else{
                        normalReactions[key] = value;
                        fs.writeFile("normalReactions.txt", JSON.stringify(normalReactions), (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                console.log('normal written');
                            };
                        });
                    }
                }else{
                    msg.channel.send("no divider: ';'");
                }
            }
            if(msg.content.startsWith('delete reaction: ', 4)){ //delete reaction loop
                const message = msg.content;
                const key = message.slice(21);
                if(includingReactions[key]) {
                    delete includingReactions[key];
                    fs.writeFile("includingReactions.txt", JSON.stringify(includingReactions), (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('including deleted');
                        }
                    });
                }
                if(caseInsensitiveReactions[key]) {
                    delete caseInsensitiveReactions[key];
                    fs.writeFile("caseInsensitiveReactions.txt", JSON.stringify(caseInsensitiveReactions), (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('case insensitive deleted');
                        }
                    });
                }
                if(includingCaseInsensitiveReactions[key]) {
                    delete caseInsensitiveReactions[key];
                    fs.writeFile("includingCaseInsensitiveReactions.txt", JSON.stringify(includingCaseInsensitiveReactions), (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('including case insensitive deleted');
                        }
                    });
                }
                if(normalReactions[key]) {
                    delete normalReactions[key];
                    fs.writeFile("normalReactions.txt", JSON.stringify(normalReactions), (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('normal deleted');
                        }
                    });
                }else {
                    msg.channel.send('this reaction does not exist');
                };
            }
            if(msg.content.startsWith('show reactions', 4)){ //show reaction loop
                if(msg.content.startsWith('including case insensitive', 19)){
                    const tempArr = []
                    for(key in includingCaseInsensitiveReactions){
                        tempArr.push(key)
                    }
                    console.log(tempArr);
                    const tempString = tempArr.join('; ')
                    console.log(tempString);
                    msg.channel.send(tempString);
                }else if(msg.content.startsWith('case insensitive', 19)){
                    const tempArr = []
                    for(key in caseInsensitiveReactions){
                        tempArr.push(key)
                    }
                    console.log(tempArr);
                    const tempString = tempArr.join('; ')
                    console.log(tempString);
                    msg.channel.send(tempString);
                }else if(msg.content.startsWith('including', 19)){
                    const tempArr = []
                    for(key in includingReactions){
                        tempArr.push(key)
                    }
                    console.log(tempArr);
                    const tempString = tempArr.join('; ')
                    console.log(tempString);
                    msg.channel.send(tempString);
                }else if(msg.content.startsWith('normal', 19)){
                    const tempArr = []
                    for(key in normalReactions){
                        tempArr.push(key)
                    }
                    console.log(tempArr);
                    const tempString = tempArr.join('; ')
                    console.log(tempString);
                    msg.channel.send(tempString);
                }else if(msg.content.startsWith('all', 19)){
                    let tempArr = []
                    let tempString = '**normal: **'
                    for(key in normalReactions){
                        tempArr.push(key)
                    }
                    tempString = tempString.concat(tempArr.join('; '));
                    tempString = tempString.concat('**| including: **');
                    tempArr = []
                    for(key in includingReactions){
                        tempArr.push(key)
                    }
                    tempString = tempString.concat(tempArr.join('; '));
                    tempString = tempString.concat('|** case insensitive: **');
                    tempArr = []
                    for(key in caseInsensitiveReactions){
                        tempArr.push(key)
                    }
                    tempString = tempString.concat(tempArr.join('; '));
                    tempString = tempString.concat('|** including case insensitive: **');
                    tempArr = []
                    for(key in includingCaseInsensitiveReactions){
                        tempArr.push(key)
                    }
                    tempString = tempString.concat(tempArr.join('; '));
                    msg.channel.send(tempString);
                }else{
                    msg.channel.send('wrong or no identifier.');
                }
            }
            if(msg.content.startsWith('online message: ', 4)){
                console.log('online');
                let skipOnlineMessageStr = skipOnlineMessage.toString();
                const id = msg.guild.systemChannelId;
                if(msg.content.startsWith('on', 20)){
                    if(skipOnlineMessage.includes(id)){
                        skipOnlineMessage.shift(id);
                    }else{
                        msg.channel.send('It is already on.');
                    }
                }else if(msg.content.startsWith('off', 20)){
                    if(skipOnlineMessage.includes(id)){
                        msg.channel.send('It is already off.');
                    }else{
                        skipOnlineMessage = skipOnlineMessage.concat(id);
                    }
                }else if(msg.content.startsWith('toggle', 20)){
                    if(skipOnlineMessage.includes(id)){
                        skipOnlineMessage.shift(id);
                    }else{
                        skipOnlineMessage = skipOnlineMessage.concat(id);
                    }
                }else{
                    msg.channel.send("you didn't specify how to switch.")
                }
                fs.writeFile("skipOnlineMessage.txt", skipOnlineMessage.toString(), (err) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('skipping changed');
                    }
                });
            }
            if(msg.content.slice(4) === "help") {
                fs.readFile("help.txt", "utf8", (err,data) => {
                    if(err){
                        console.log(err);
                    }else{
                        msg.channel.send(data);
                    };
                });
            }
        }
    }
});