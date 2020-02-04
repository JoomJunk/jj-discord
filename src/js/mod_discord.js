/**
* @package    JJ_Discord
* @copyright  Copyright (C) 2011 - 2019 JoomJunk. All rights reserved.
* @license    GPL v3.0 or later https://www.gnu.org/licenses/gpl-3.0.html
*/

(() => {
	window.addEventListener('DOMContentLoaded', () => {

		const options = Joomla.getOptions('discord');
		const wrapper = document.getElementById('jj-discord');
		const settings = {
			method: 'GET',
			mode: 'cors',
			cache: 'reload',
		};

		if (options.server.length > 0) {
			fetch(`https://discordapp.com/api/guilds/${options.server}/widget.json`, settings).then(response => {
				if (response.status != 200) {
					console.log(response.status);
					return;
				}
				response.json().then(data => {
					const users = data.members;

					if (options.membersCount == 1) {
						document.getElementById('jj-discord-count').innerHTML = `<strong>${users.length}</strong> Members Online`;
					}

					// Set the connect button link
					if (options.connect == 1) {
						const inviteLink = data.instant_invite.replace('https', 'discord');
						document.getElementById('jj-discord-connect').setAttribute('href', inviteLink);
					}

					// Create a new object with the channel_id as the key
					const channels = {};
					data.channels.forEach(({id, position, name}) => {
						channels[id] = {
							position: position,
							name: name,
							members: [],
						};
					});

					users.forEach(user => {
						// Assign members connected to a channel so that specific object
						if (user.channel_id !== undefined) {
							channels[user.channel_id].members.push(user);
						}
					});

					if (options.members == 1) {
						const membersList = document.getElementById('jj-discord-members');

						users.forEach(user => {
							// Create list
							const membersListItem = document.createElement('li');
							membersListItem.classList.add('jj-flex', 'jj-flex-middle');

							const memberStatus = document.createElement('span');
							if (user.status === 'online') {
								memberStatus.classList.add('jj-discord-user-status', 'jj-discord-user-online');
							}
							else if (user.status === 'idle') {
								memberStatus.classList.add('jj-discord-user-status', 'jj-discord-user-idle');
							}
							else {
								memberStatus.classList.add('jj-discord-user-status', 'jj-discord-user-offline');
							}

							membersListItem.appendChild(createAvatar(user.avatar_url));
							membersListItem.appendChild(memberStatus);
							membersListItem.appendChild(createUsername(user));

							if (user.bot) {
								membersListItem.appendChild(createBotTag());
							}

							if (options.game == 1 && user.game !== undefined && !user.bot) {
								memberGame = document.createElement('span');
								memberGame.classList.add('jj-discord-game');
								memberGame.innerText = ` - ${user.game.name}`;
								membersListItem.appendChild(memberGame);
							}

							membersList.appendChild(membersListItem);
						});
					}

					// Need to reorder the object by channel.position
					Object.keys(channels).forEach(key => {
						channels[channels[key].position] = channels[key];
						delete channels[key];
					});

					// Loop thorugh the object and display the results
					Object.keys(channels).forEach(key => {
						const channel = channels[key];

						const channelItem = document.createElement('li');
						channelItem.innerText = channel.name;

						const channelMembersList = document.createElement('ul');

						channel.members.forEach(member => {
							const memberItem = document.createElement('li');
							memberItem.classList.add('jj-discord-user');

							// Append avatar and username to the left Div
							const divLeft = document.createElement('div');
							divLeft.classList.add('jj-discord-user-left');
							divLeft.appendChild(createAvatar(member.avatar_url));
							divLeft.appendChild(createUsername(member));

							if (member.bot) {
								divLeft.appendChild(createBotTag());
							}

							// Append microphone/headphone icons
							const divRight = document.createElement('div');
							divRight.classList.add('jj-discord-user-right');
							if (member.self_mute) {
								divRight.insertAdjacentHTML('beforeend', `<img src="${options.root}/media/mod_discord/images/microphone.svg" alt="">`);
							}
							if (member.self_deaf) {
								divRight.insertAdjacentHTML('beforeend', `<img src="${options.root}/media/mod_discord/images/headset.svg" alt="">`);
							}

							memberItem.appendChild(divLeft);
							memberItem.appendChild(divRight);

							// Append to the list
							channelMembersList.appendChild(memberItem);
						});

						channelItem.appendChild(channelMembersList);
						wrapper.appendChild(channelItem);
					});
				})
			}).catch(err => {
				console.log(err)
			});
		}
	});

	const createAvatar = (url) => {
		const avatar = document.createElement('img');
		avatar.setAttribute('src', url);
		avatar.classList.add('jj-discord-avatar');

		return avatar;
	}

	const createBotTag = () => {
		const bot = document.createElement('span');
		bot.classList.add('jj-discord-bot');
		bot.innerText = 'BOT';

		return bot;
	}

	const createUsername = (user) => {
		const username = document.createElement('span');
		username.innerText = user.nick || user.username;

		return username;
	}
})();
