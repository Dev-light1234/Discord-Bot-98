const Discord = require('discord.js');
const client = new Discord.Client();
// eslint-disable-next-line no-unused-vars


client.on('message', message => {
	if (message.content === `${process.env.prefix}joy`) {
		message.react('😂');
	}
	if (message.content === `${process.env.prefix}yes/no`) {
		message.react('✅')
			.then(() => message.react('❌'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
	else if (message.content === `${process.env.prefix}fistbump`) {
		message.react('👊').catch(() => console.error('One of the emojis failed to react.'));
	}
	else if (message.content === `${process.env.prefix}fistbump2`) {
		message.react('🤜')
			.then(() => message.react('🤛'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
	else if (message.content === `${process.env.prefix}ok`) {
		message.react('👌').catch(() => console.error('One of the emojis failed to react.'));
	}
	else if (message.content === `${process.env.prefix}birthday`) {
		message.react('🎂')
			.then(() => message.react('🎁'))
			.then(() => message.react('🎈'))
			.then(() => message.react('🎉'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
	else if (message.content === `${process.env.prefix}school`) {
		message.react('😫')
			.then(() => message.react('📖'))
			.then(() => message.react('📚'))
			.then(() => message.react('✏'))
			.then(() => message.react('📝'))
			.then(() => message.react('✏'))
			.then(() => message.react('📝'))
			.then(() => message.react('✏'))
			.then(() => message.react('📝'))
			.then(() => message.react('🕐'))
			.then(() => message.react('🕥'))
			.then(() => message.react('🕚'))
			.then(() => message.react('✏'))
			.then(() => message.react('📝'))
			.then(() => message.react('😫'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.login(process.env.token);