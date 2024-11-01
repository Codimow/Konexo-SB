module.exports = {
    name: 'status',
    description: 'Set your custom status',
    async execute(message, args) {
        const status = args.join(' ');
        await message.client.user.setActivity(status);
        await message.reply(`Status set to: ${status}`);
    },
};
