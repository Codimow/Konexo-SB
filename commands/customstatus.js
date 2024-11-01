let statusInterval;
let statusList = [];

module.exports = {
    name: 'customstatus',
    description: 'Manage custom status updates',
    async execute(message, args) {
        const action = args[0];

        switch (action) {
            case 'add':
                const newStatus = args.slice(1).join(' ');
                statusList.push(newStatus);
                await message.reply(`Added "${newStatus}" to your custom status list.`);
                break;

            case 'list':
                if (statusList.length === 0) {
                    await message.reply('Your custom status list is empty.');
                } else {
                    await message.reply('Your custom status list:\n' + statusList.map((status, index) => `${index + 1}. ${status}`).join('\n'));
                }
                break;

            case 'remove':
                const index = parseInt(args[1]) - 1;
                if (isNaN(index) || index < 0 || index >= statusList.length) {
                    await message.reply('Please provide a valid status number to remove.');
                } else {
                    const removed = statusList.splice(index, 1);
                    await message.reply(`Removed "${removed[0]}" from your custom status list.`);
                }
                break;

            case 'start':
                const interval = parseInt(args[1]);
                if (isNaN(interval) || interval < 1) {
                    await message.reply('Please provide a valid interval in minutes.');
                    return;
                }
                if (statusList.length === 0) {
                    await message.reply('Your custom status list is empty. Add some statuses first!');
                    return;
                }
                if (statusInterval) clearInterval(statusInterval);
                let currentIndex = 0;
                statusInterval = setInterval(() => {
                    const status = statusList[currentIndex];
                    message.client.user.setActivity(status);
                    currentIndex = (currentIndex + 1) % statusList.length;
                }, interval * 60000);
                await message.reply(`Started custom status updates with ${interval} minute intervals.`);
                break;

            case 'stop':
                if (statusInterval) {
                    clearInterval(statusInterval);
                    statusInterval = null;
                    await message.reply('Stopped custom status updates.');
                } else {
                    await message.reply('Custom status updates are not currently running.');
                }
                break;

            default:
                await message.reply('Usage: !customstatus add <status> | list | remove <number> | start <interval_minutes> | stop');
        }
    },
};
