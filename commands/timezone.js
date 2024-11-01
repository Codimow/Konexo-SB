const moment = require('moment-timezone');

module.exports = {
    name: 'timezone',
    description: 'Convert time between different time zones',
    async execute(message, args) {
        if (args.length < 3) {
            return message.reply('Usage: !timezone <time> <from_timezone> <to_timezone>\nExample: !timezone 15:00 America/New_York Europe/London');
        }

        const [time, fromTimezone, toTimezone] = args;

        // Validate time format (HH:mm or H:mm)
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            return message.reply('Invalid time format. Please use HH:mm or H:mm.');
        }

        // Validate timezones
        if (!moment.tz.zone(fromTimezone) || !moment.tz.zone(toTimezone)) {
            return message.reply('Invalid timezone(s). Please use valid IANA time zone names.');
        }

        try {
            const [hours, minutes] = time.split(':').map(Number);
            const sourceTime = moment.tz({ hour: hours, minute: minutes }, fromTimezone);
            const convertedTime = sourceTime.clone().tz(toTimezone);

            const reply = `
🕒 Time Zone Conversion 🕒
${time} in ${fromTimezone} is ${convertedTime.format('HH:mm')} in ${toTimezone}

Date: ${convertedTime.format('MMMM D, YYYY')}
Day: ${convertedTime.format('dddd')}

From: ${fromTimezone} (${sourceTime.format('z')})
To: ${toTimezone} (${convertedTime.format('z')})

Time Difference: ${convertedTime.utcOffset() - sourceTime.utcOffset()} minutes
            `.trim();

            await message.reply(reply);
        } catch (error) {
            console.error('Error converting time:', error);
            await message.reply('An error occurred while converting the time. Please check your input and try again.');
        }
    },
};
