const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');


const client = new Client({intents : [Intents.FLAGS.GUILDS]});

client.commands = new Collection();
const commandFIles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log('Ready to work!');
});

for(const file of commandFIles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command  = client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content : 'There was an unexpected error while executing the command', ephemeral:true})
    }
})

client.login(token);