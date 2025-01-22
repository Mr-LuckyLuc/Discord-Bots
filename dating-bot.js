require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file
const { channel } = require("diagnostics_channel");
const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, ChannelType, PermissionFlagsBits, messageLink, Message, User, InteractionCollector } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent,], Partials: [], autoReconnect: true})
const fs = require('fs');

client.login(process.env.TOKEN);

client.once("ready", () => {
    console.log("BOT IS ONLINE.");
});

let waiting;
let waitingId;
let allowAdmin;
let dublicate = {};
fs.readFile("dublicate.txt", "utf8", (err,data) => {
    if(err){
        console.log(err);
    }else{
        console.log(data)
        dublicate = JSON.parse(data);
    };
});
client.on('messageCreate', (msg) => {
    console.log(msg.guild.roles.cache);
    if(msg.content.startsWith('db! ')){
        const command = msg.content.slice(4)
        if(command === 'date'){
            if(waitingId === undefined){
                waiting = msg.author.username;
                waitingId = msg.author.id;
                msg.channel.send('waiting');
            }else if(waitingId === msg.author.id) {
                msg.channel.send("you are already wating");
            }else {
                let username = msg.author.username;
                let channelName = waiting+"s and "+username+"s date";
                let channelName2 = username+"s and "+waiting+"s date";
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
                while(channelName.includes(' ')){
                    channelName = channelName.replace(' ', '-').toLowerCase();
                }
                while(channelName2.includes(' ')){
                    channelName2 = channelName2.replace(' ', '-').toLowerCase();
                }
                if(!(channelNames.includes(channelName) || channelNames.includes(channelName2))){
                    msg.guild.channels.create({
                        name: channelName,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: msg.guild.roles.everyone.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },{
                                id: msg.author.id,
                                allow: [PermissionFlagsBits.ViewChannel],
                            },{
                                id: waitingId,
                                allow: [PermissionFlagsBits.ViewChannel],
                            },
                        ],
                    });
                    msg.channel.send('channel created');
                }else{
                    msg.channel.send('you have already been pared with the person currently waiting.')
                };
                waiting = undefined;
                waitingId = undefined;
            }
        }
        if(command === 'stop date'){
            if(msg.channel.name.endsWith('-date')){    
                msg.channel.delete();
            }else{
                msg.channel.send('this is not a personal dating channel');
            };
        };
        if(command === 'no date'){
            if(msg.author.id === waitingId){   
                waiting = undefined;
                waitingId = undefined;
                msg.channel.send('you are no longer waiting for a date');
            }else{
                msg.channel.send('you are not the one waiting');
            };
        };
        if(command.startsWith('allow admin ')){
            const toAllow = command.slice(12);
            dateMembers = (msg.guild.channels.cache.find(channel => channel.name === toAllow).members);
            if(toAllow.endsWith('-date')){
                dateMembers.map(item => {
                    if(item.user.username === msg.author.username){
                        const guild = client.guilds.cache.get(msg.guild.id);
                        const channelNames = guild.channels.cache.map(channel => channel.name);;
                        if(channelNames.includes('admin-helpers')){
                            const channel = msg.guild.channels.cache.find(channel => channel.name === "admin-helpers");
                            allowAdmin = msg.channel.id;
                            channel.send('help requested, `db! admin help` to help.');
                        };
                    }
                });
            }else{
                msg.channel.send('this is not a dating channel');
            };
        }
        if(command.startsWith('dublicate ')){
            const channelName = command.slice(10);
            if(channelName.endsWith('-date')){
                console.log("dupe");
                const channelObj = msg.guild.channels.cache.find(channel => channel.name === channelName);
                const channelObjId = channelObj.id;
                channelObj.clone(Option = {
                    name: channelName+"-duplicate",
                    permissionOverwrites: [
                        {
                            id: msg.guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },{
                            id: msg.author.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },{
                            id: msg.guild.roles.cache.find(role => role.name === 'mod').id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(() => {
                    const dupeChannelID = msg.guild.channels.cache.find(channel => channel.name === channelName+"-duplicate").id;
                    console.log(dupeChannelID);
                    dublicate[channelObjId] = dupeChannelID;
                    console.log(dublicate);
                });
                console.log(JSON.stringify(dublicate));
                fs.writeFile("dublicate.txt", JSON.stringify(dublicate), (err) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('dublicating changed');
                    }
                });
            }else{
                msg.channel.send('this is not a valid channel.');
            }
        }
        if(command === 'admin help'){
            console.log("help");
            const channel = msg.guild.channels.cache.get(allowAdmin);
            channel.permissionOverwrites.edit(msg.author.id, { ViewChannel: true });
        };
    };
    for(ID in dublicate){
        if(ID === msg.channel.id){
            const dublicateChannel = msg.guild.channels.cache.get(dublicate[ID])
            dublicateChannel.send(msg.author.username);
            dublicateChannel.send(msg.content);
        }
    }
});