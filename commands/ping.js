
module.exports = {
    name: 'ping',
    description: 'Ping!',
    async execute(message, args) {
        await message.reply('Pong!');
    },
};
module.exports = {
    name: 'ping',
    description: 'Ping! Shows the latency.',
    async execute(message, args) {
        const sent = await message.reply('Pinging...');
        const roundtripLatency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);
        
        await sent.edit(`Pong! 🏓\nRoundtrip latency: ${roundtripLatency}ms\nAPI Latency: ${apiLatency}ms`);
    },
};
