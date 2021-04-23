const Discord = require('discord.js');
const client = new Discord.Client();

const https = require('https');
const keepAlive = require('./server.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity('with pins');
	keepAlive();
});

client.on('channelPinsUpdate', async (channel, time) => {
	if (time.getTime() === 0) {return} // Time is 0 when the last message is unpinned

	channel.messages.fetchPinned()
		.then(messages => {
			if (!messages) {return}

			let message = messages.last();

			if (message.guild.channels.cache.find(chan => chan.name === 'pinboard')) {
				var pinboard = message.guild.channels.cache.find(chan => chan.name === 'pinboard');
			} else {
				message.channel.send('I can\'t find a channel named `pinboard`! Please create a channel using that name.');
				message.unpin();
				return;
			}

			let embed = new Discord.MessageEmbed()
				.setDescription(`${message.content}\n\n[Jump to message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) in <#${message.channel.id}>`)
				.setTimestamp(message.createdAt)

			if (message.attachments.size > 0) {
				embed.setImage(message.attachments.first().url)
			}

			pinboard.fetchWebhooks()
				.then(webhooks => {
					let pinhook = webhooks.find(hook => hook.owner.id === client.user.id);

					if (!pinhook) {
						pinhook = pinboard.createWebhook('PinBoard', {
							avatar: client.user.displayAvatarURL({dynamic: true}),
						});
					}

					pinhook.send({
						username: message.author.username,
						avatarURL: message.author.displayAvatarURL(),
						embeds: [embed],
					});
					message.unpin({
						reason: 'Moved to the pinboard'
					});
				});
		});
});

client.login(process.env.token);