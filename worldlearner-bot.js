require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file
const { channel } = require("diagnostics_channel");
const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, ChannelType, PermissionFlagsBits, messageLink, Message, User, InteractionCollector } = require('discord.js');
const { setServers } = require("dns");
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent,], Partials: [], autoReconnect: true})
const fs = require('fs');
const { listeners } = require("process");

/*function readFile(file) {
    fs.readFile(file,"utf8", (err,data) =>{
        if(err){
            console.log(err)
        }else{
            return data
        }
    })
}
function writeFile(file,data) {
    fs.writeFile(file,data,"utf8", (err) =>{
        if(err){
            console.log(err);
        }
    })
}*/

client.login(process.env.TOKEN);

client.once("ready", () => {
    console.log("BOT IS ONLINE.");
});

const prefix = "wl! ";
const prefixLength = prefix.length;
let wordsets;
fs.readFile("wordsets.txt","utf8", (err,data) =>{
    if(err){
        console.log(err)
    }else{
        wordsets = JSON.parse(data)
    }
})
let waiting = false;
let spelen = false;
let idx;
let learningchannel;
let wordlist = {};
let spelers = [];
let set;
let klaar = true;
function makeList(amount,set){
    let words = {}
    let sets = Object.keys(wordsets);
    if(set === "alles"){
        for(const i of sets){
            let list = wordsets[i]
            words = {...words, ...list}
        }
    }else if(!sets.includes(set)){
        learningchannel.send("deze set bestaat niet, probeer opnieuw")
        waiting = true;
        spelen = false;
        return;
    }else{
        words = wordsets[set];
    }
    let chooseIdx;
    let key;
    for(let i = 0; i < amount; i++){
        chooseIdx = Math.floor(Math.random()*Object.keys(words).length);
        key = Object.keys(words)[chooseIdx];
        wordlist[key] = words[key];
        idx = key;
    }
    learningchannel.send(idx);
}
function nextWord() {
    delete wordlist[idx];
    idx = Math.floor(Math.random()*Object.keys(wordlist).length);
    idx = Object.keys(wordlist)[idx];
    if(idx === undefined){
        spelen = false;
        learningchannel.send("de reeks is klaar")
        spelers = [];
    }
    else{
        learningchannel.send(idx);
    }
}
function wait(ms) {
    klaar = false;
    const start = Date.now();
	let now = start;
    while ( (now - start) < ms ) { now = Date.now(); }
    klaar = true;
}

client.on("messageCreate", (msg) => {
    if(!msg.author.bot){
        if(waiting){
            if(msg.content === "speel"){
                spelers.push(msg.author);
                msg.channel.send(msg.author.username+" doet mee")
            }else if(msg.content.startsWith("start ")){
                set = msg.content.slice(6)
                spelen = true;
                learningchannel = msg.channel;
                msg.channel.send("hoeveel woorden?")
            }else if((Number(msg.content) !== NaN) && spelen){
                makeList(Number(msg.content),set)
                waiting = false;
            }
        }else{
            if(msg.content.startsWith(prefix)){
                const command = msg.content.slice(prefixLength)
                if(command === 'start'){
                    msg.channel.send('`speel` om mee te doen `start <set>` om te sarten')
                    waiting = true
                }
                if(command === 'stop'){
                    waiting = false;
                    spelen = false;
                    idx = undefined;
                    learningchannel = undefined;
                    wordlist = {};
                    spelers = [];
                }
                if(command.startsWith("add ")){
                    const newList = JSON.parse(command.slice(4));
                    const add = {...wordsets,...newList};
                    fs.writeFile("wordsets.txt",add, (err) =>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log("list changed")
                        }
                    })
                }
                if(command === 'help'){
                    fs.readFile("wl-help.txt","utf8", (err,data) =>{
                        if(err){
                            console.log(err)
                        }else{
                            msg.channel.send(data)
                        }
                    })
                }
                if(command === 'test'){
                    learningchannel = msg.channel;
                    makeList(20,"test");
                }
            }
            if(spelen){
                if(spelers.includes(msg.author) && !waiting && !msg.content.startsWith("//") && msg.channel === learningchannel && klaar){
                    if(msg.content === wordlist[idx]){
                        msg.channel.send("goed geraden");
                        wait(2000);
                        nextWord();
                    }else{
                        msg.channel.send('Dit is fout, het juiste antwoord was: '+wordlist[idx]);
                        nextWord();
                    }
                }
            }
        }
    }
})