require("dotenv").config({ path: __dirname+'/timer.env' }); //to start process from .env file
const { Client, Intents, GatewayIntentBits, IntentsBitField, Guild} = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent], autoReconnect: true });

let countDownMsg = null;
let AnnouncementChannel;
let nextHourS;
let lastHourS;
const role = "StairClub";

async function initCounter() {
    const now = Date.now();
    const nextHourMsDelay = 3600000-now%3600000;
    nextHourS = Math.round((now + nextHourMsDelay)/1000);
    AnnouncementChannel = await client.guilds.cache.find(guild => guild.name == "Studygroup ‧₊˚✩").channels.cache.find(channel => channel.name === 'announcements-‧₊˚✩');
    countDownMsg = await AnnouncementChannel.send(`# NEXT STAIRCLIMB <t:${nextHourS}:R> #`);
    setTimeout(changeTime,nextHourMsDelay);
}
  //.find(channel => channel.name === 'announcements-‧₊˚✩');
async function changeTime() {
    console.log("HOUR");
    ping();
    lastHourS = nextHourS;
    nextHourS += 3600;
    console.log(countDownMsg);
    if (countDownMsg) countDownMsg.edit(`# NEXT STAIRCLIMB <t:${nextHourS}:R> #\nPrevious walk was <t:${lastHourS}:R>`);
    setTimeout(changeTime,3600000);
}

async function ping() {

    AnnouncementChannel.send(`@${role}`)
        .then(msg => {
            msg.delete();
        });

}

client.login(process.env.TOKEN);

client.on("ready", () =>{
    console.log("BOT IS ONLINE"); //msg when bot is online
    initCounter();
});