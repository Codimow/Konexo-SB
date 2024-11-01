const { Client } = require('discord.js-selfbot-v13');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    checkUpdate: false
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const PREFIX = '!';
client.commands = new Map();

client.chatStats = {
    messagesSent: 0,
    messagesReceived: 0,
    charactersSent: 0,
    charactersReceived: 0,
    topChannels: {},
    topServers: {},
    channelNames: {},
    serverNames: {}
};

async function loadStats() {
    const { data, error } = await supabase
        .from('chat_stats')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        console.error('Error loading stats:', error);
    } else if (data) {
        client.chatStats = {
            messagesSent: data.messages_sent,
            messagesReceived: data.messages_received,
            charactersSent: data.characters_sent,
            charactersReceived: data.characters_received,
            topChannels: data.top_channels || {},
            topServers: data.top_servers || {},
            channelNames: data.channel_names || {},
            serverNames: data.server_names || {}
        };
    }
}

async function saveStats() {
    const { error } = await supabase
        .from('chat_stats')
        .update({
            messages_sent: client.chatStats.messagesSent,
            messages_received: client.chatStats.messagesReceived,
            characters_sent: client.chatStats.charactersSent,
            characters_received: client.chatStats.charactersReceived,
            top_channels: client.chatStats.topChannels,
            top_servers: client.chatStats.topServers,
            channel_names: client.chatStats.channelNames,
            server_names: client.chatStats.serverNames
        })
        .eq('id', 1);

    if (error) {
        console.error('Error saving stats:', error);
    }
}

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await loadStats();
});

client.on('messageCreate', async (message) => {
    // Update chat statistics
    if (message.author.id === client.user.id) {
        client.chatStats.messagesSent++;
        client.chatStats.charactersSent += message.content.length;
    } else {
        client.chatStats.messagesReceived++;
        client.chatStats.charactersReceived += message.content.length;
    }

    // Update top channels and servers
    const channelId = message.channel.id;
    const serverId = message.guild ? message.guild.id : 'DM';
    
    client.chatStats.topChannels[channelId] = (client.chatStats.topChannels[channelId] || 0) + 1;
    client.chatStats.topServers[serverId] = (client.chatStats.topServers[serverId] || 0) + 1;

    // Store channel and server names
    if (message.channel.type === 'DM') {
        client.chatStats.channelNames[channelId] = 'DM';
        client.chatStats.serverNames[serverId] = 'DM';
    } else {
        client.chatStats.channelNames[channelId] = message.channel.name;
        client.chatStats.serverNames[serverId] = message.guild.name;
    }

    // Save stats every 10 messages
    if ((client.chatStats.messagesSent + client.chatStats.messagesReceived) % 10 === 0) {
        await saveStats();
    }

    if (message.author.id !== client.user.id || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        await client.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error(error);
        await message.channel.send('There was an error executing that command.');
    }
});

client.login(process.env.DISCORD_TOKEN);
