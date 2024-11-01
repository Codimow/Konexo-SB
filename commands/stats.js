const { MessageEmbed } = require('discord.js-selfbot-v13');

module.exports = {
    name: 'stats',
    description: 'Display chat statistics',
    async execute(message, args) {
        const chatStats = message.client.chatStats;

        if (!chatStats) {
            return message.reply('Chat statistics are not available at the moment.');
        }

        // Sort and get top 5 channels
        const topChannels = Object.entries(chatStats.topChannels || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => `<#${id}>: ${count} messages`)
            .join('\n');

        // Sort and get top 5 servers
        const topServers = Object.entries(chatStats.topServers || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => id === 'DM' ? `DMs: ${count} messages` : `<@${id}>: ${count} messages`)
            .join('\n');

        const statsMessage = `
📊 Chat Statistics 📊

Messages Sent: ${chatStats.messagesSent}
Messages Received: ${chatStats.messagesReceived}
Characters Sent: ${chatStats.charactersSent}
Characters Received: ${chatStats.charactersReceived}

Top 5 Channels:
${topChannels || 'No data available'}

Top 5 Servers/DMs:
${topServers || 'No data available'}
        `.trim();

        await message.reply(statsMessage);
    },
};
