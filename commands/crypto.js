const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency',
    async execute(message, args) {
        if (args.length < 1) {
            return message.reply('Please provide a cryptocurrency symbol. Example: !crypto bitcoin');
        }

        const coin = args[0].toLowerCase();
        const currency = args[1] ? args[1].toLowerCase() : 'usd';

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}&include_24hr_change=true`);
            
            if (response.data && response.data[coin]) {
                const price = response.data[coin][currency];
                const change24h = response.data[coin][`${currency}_24h_change`];
                
                const changeEmoji = change24h >= 0 ? '📈' : '📉';
                const changeColor = change24h >= 0 ? '🟢' : '🔴';

                const replyMessage = `
${coin.charAt(0).toUpperCase() + coin.slice(1)} (${coin.toUpperCase()}) 💰
Price: ${price.toLocaleString()} ${currency.toUpperCase()}
24h Change: ${changeColor} ${change24h.toFixed(2)}% ${changeEmoji}
                `.trim();

                await message.reply(replyMessage);
            } else {
                await message.reply(`Couldn't find data for ${coin}. Make sure you're using the correct name (e.g., 'bitcoin', 'ethereum').`);
            }
        } catch (error) {
            console.error('Error fetching cryptocurrency data:', error);
            await message.reply('An error occurred while fetching the cryptocurrency data. Please try again later.');
        }
    },
};
