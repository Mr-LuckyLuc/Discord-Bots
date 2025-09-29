console.log("Starting");

require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file

const path = require('node:path');
const fs = require('node:fs');

const { Client, Collection, Events, GatewayIntentBits, REST, Routes} = require('discord.js');
const { log } = require("node:console");

// setup ----------------------------------------------

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Construct and prepare an instance of the REST module
let ranks = [];

fs.readFile("./promotionBot/ranks.txt", "utf8", (err,data) => {
    if(err){
        console.error(err);
    }else{
        ranks = data.split(",");
        client.ranks = ranks;
    }
});

let users = {};

fs.readFile("./promotionBot/enlisted.txt", "utf-8", (err, data) => {
    if (err) {
        console.error(err)
    } else {
        users = JSON.parse(data);
        client.enlisted = users;
    }
})

const commandsPath = path.join(__dirname, "promotionBot");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = new Collection();

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Start Bot ----------------------------

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    const jsonCommands = commands.map(command => command.data.toJSON())

    const data = await rest.put(
    // Routes.applicationCommands(process.env.CLIENTID), //for all guilds
    Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
        { body: jsonCommands },);
    console.log(`Successfully reloaded ${data.length} commands.`);
})();

client.on(Events.InteractionCreate, (interaction) => {
    
    if (interaction.isChatInputCommand()) {

        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        
        command.execute(interaction);
    }
})

client.login(process.env.TOKEN);