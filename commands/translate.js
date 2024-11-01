const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    name: 'translate',
    description: 'Translate text to another language',
    async execute(message, args) {
        if (args.length < 3) {
            return message.reply('Usage: !translate <source_lang> <target_lang> <text>\nExample: !translate en es Hello, how are you?');
        }

        const sourceLang = args.shift();
        const targetLang = args.shift();
        const text = args.join(' ');

        try {
            const result = await translate(text, { from: sourceLang, to: targetLang });
            await message.reply(`Translation (${sourceLang} → ${targetLang}):\n${result.text}`);
        } catch (error) {
            console.error('Translation error:', error);
            await message.reply('An error occurred during translation. Please check your language codes and try again.');
        }
    },
};
