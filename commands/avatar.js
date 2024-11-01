module.exports = {
    name: 'avatar',
    description: 'Get user avatar',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        await message.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`);
    },
};
