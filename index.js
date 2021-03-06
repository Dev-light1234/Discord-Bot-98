require('events').EventEmitter.prototype._maxListeners = 0;
var m = {
	count: 0,
	startups: 0,
	errors: 0,
};
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const adminFiles = fs.readdirSync('./commands/administrator').filter(file => file.endsWith('.js'));

for (const file of adminFiles) {
	const command = require(`./commands/administrator/${file}`);
	client.commands.set(command.name, command);
}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const musicFiles = fs.readdirSync('./music').filter(file => file.endsWith('.js'));

for (const file of musicFiles) {
	const command = require(`./music/${file}`);
	client.commands.set(command.name, command);
}

const economyFiles = fs.readdirSync('./economy').filter(file => file.endsWith('.js'));

for (const file of economyFiles) {
	const command = require(`./economy/${file}`);
	client.commands.set(command.name, command);
}


const cooldowns = new Discord.Collection();
client.on('message', message => {
	if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;
	if (message.content.startsWith(process.env.prefix) || message.author.bot) {
		m.count++;
	}
	const args = message.content.slice(process.env.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		// eslint-disable-next-line quotes
		message.channel.send("I can't execute that command in DM's!");
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author.username}!`;

		if (command.usage) {
			reply += `The proper usage would be: \`${process.env.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply).catch(err => console.log(err));
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 5;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 10;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		const exampleEmbed = new Discord.RichEmbed()
			.setColor(process.env.DefaultColor)
			.setTitle('There was an error trying to execute that command!');
		message.channel.send(exampleEmbed);
	}
});

client.once('ready', () => {
	console.log(`${client.users.size} Total Users`);
	console.log(`${client.guilds.size} Total Servers`);
	console.log(`${client.channels.size} Total Channels`);
	console.log(`${client.user.tag}`);
	console.log(`Total Messages: ${m.count}`);
});

client.on('guildCreate', guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on('guildDelete', guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id}) (members: ${guild.memberCount})`);
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
process.setMaxListeners(0);
client.on('ready', () => {
	client.user.setPresence({
		game: {
			name: `${process.env.prefix}weather (city)`,
			type: 'WATCHING',
		},
		status: 'online',
	});
});

client.login(process.env.token);