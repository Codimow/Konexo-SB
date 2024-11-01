const axios = require('axios');

module.exports = {
    name: 'urban',
    description: 'Look up a term on Urban Dictionary',
    async execute(message, args) {
        const term = args.join(' ');
        try {
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
            const definition = response.data.list[0];
            if (definition) {
                await message.reply(`**${term}**: ${definition.definition}\n\nExample: ${definition.example}`);
            } else {
                await message.reply(`No definition found for "${term}"`);
            }
        } catch (error) {
            await message.reply('An error occurred while fetching the definition.');
        }
    },
};
