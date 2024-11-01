const https = require('https');

module.exports = {
    name: 'shorten',
    description: 'Shorten a URL using TinyURL',
    async execute(message, args) {
        if (args.length !== 1) {
            return message.reply('Usage: !shorten <url>\nExample: !shorten https://www.example.com');
        }

        const longUrl = args[0];

        https.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                message.reply(`Shortened URL: ${data}`);
            });
        }).on('error', (err) => {
            console.error('URL shortening error:', err);
            message.reply('An error occurred while shortening the URL. Please try again.');
        });
    },
};
