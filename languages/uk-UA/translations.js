/* eslint-disable semi */
const {maxLengthTeamName, invite, join} = require('../../config.json');
const base = structuredClone(require('../base'));
base.command.compare.description = 'Compare both user stats';
base.command.dailystats.description = 'Displays the stats of the chosen day, with elo graph of the day';
base.command.find.description = 'Find the games that includes the players requested (up to 5)';
base.command.help.description = 'Display the command list';
base.command.info.description = 'Get the info about the bot';
base.command.invite.description = 'Get the link to invite the bot on your server';
base.command.join.description = 'Get the link to join the community server of the bot';
base.command.last.description = 'Get the stats of last game';
base.command.laststats.description = 'Displays the stats of the x last match, with elo graph of the X last match';
base.command.link.description = 'Link a faceit profile to the discord user, to get your stats directly (no parameters needed)';
base.command.map.description = 'Displays the stats of the chosen map';
base.command.monthstats.description = 'Displays the stats of the chosen month, with elo graph of the month';
base.command.roles.description = 'Ranks are updated every hour and when you get your stats';
base.command.stats.description = 'Displays general stats, with elo graph of the 20 last games';
base.command.team.description = 'Create a team and link up to 5 users to it (limited to 1 team by discord account)';
base.command.unlink.description = 'Unlink your faceit id from the discord bot';
base.command.vote.description = 'Get the link to vote for the bot on top.gg';
base.command.weekstats.description = 'Displays the stats of the chosen week, with elo graph of the week';
base.command.yearstats.description = 'Displays the stats of the chosen year, with elo graph of the year';
base.options.matchNumber = 'Number of matches to display. Default: {default}';
base.options.steamParameter = 'steamID / steam custom ID / steam profile url / @user / CSGO status';
base.options.faceitParameter = 'faceit nickname / @user / faceit profile url';
base.options.steamParameters = 'steamIDs / steam custom IDs / steam profile urls / @users / CSGO status';
base.options.faceitParameters = 'faceit nicknames / @users / faceit profile urls';
base.options.faceitParametersTeam = 'faceit nicknames / @users / faceit profile urls (Max 5)';
base.options.steamParametersTeam = 'steamIDs / steam custom IDs / steam profile urls / @users / CSGO status (Max 5)';
base.options.teamParameter = 'team slug (you need to be a part of it, the creator, or it has to be public)';
base.options.fromDate = 'INCLUDED. Start date, format MM/DD/YYYY';
base.options.toDate = 'EXCLUDED. End date (at least 1 day interval), if empty gets the current day Format MM/DD/YYYY';
base.options.playerAimed = 'steam_parameters / faceit_parameters / @user / empty if linked';
base.options.globalUnlink = 'This will unlink your account on all servers (False by default)';
base.options.commandName = 'The name of one command';
base.options.mapName = 'Specify a map to get the stats related';
base.options.levelRoles = {
  1: '1-й рівень',
  2: '2-й рівень',
  3: '3-й рівень',
  4: '4-й рівень',
  5: '5-й рівень',
  6: '6-й рівень',
  7: '7-й рівень',
  8: '8-й рівень',
  9: '9-й рівень',
  10: '10-й рівень'
};
base.options.removeOldRoles = 'Видалити старі ролі, якщо вони існують';
base.options.generateRoles = 'Генерує ранги ролей на сервері';
base.options.setupRoles = 'Налаштувати ролі, які ви бажаєте для кожного рангу на сервері';
base.options.removeRoles = 'Removes the rank roles on the server';
base.options.infoTeam = 'Get information about your teams';
base.options.createTeam = 'Create your team';
base.options.deleteTeam = 'Delete your team';
base.options.addUserTeam = 'Add a user to your team';
base.options.updateTeam = 'Update your team';
base.options.removeUserTeam = 'Remove a user from your team';
base.options.nameTeam = `name of your team, up to ${ maxLengthTeamName } characters`;
base.options.accessTeam = 'Allow every discord users to show your team statistics';
base.options.excludedSteamParameters = 'Exclude steam parameters from the search';
base.options.excludedFaceitParameters = 'Exclude faceit parameters from the search';
base.options.discordUserLink = 'Link the user only for this server (Role management permissions to link someone else)';
base.options.nicknameLink = 'Makes your discord nickname the same as your faceit nickname (Only works with non admin users)';
base.strings.selectTeam = 'Select a team';
base.strings.infoTeam = 'Get info about the team {teamName}';
base.strings.voteDescription = 'Hey, {discord}! You can vote on top.gg to help me grow';
base.strings.messageProcessing = 'Your request is currently processing...';
base.strings.error = 'Error';
base.strings.info = 'Info';
base.strings.compare = 'Comparison between {playerName1} and {playerName2}';
base.strings.matchPlayed = '{matchNumber} matches played';
base.strings.selectDate = 'Select a date';
base.strings.helpInfo = 'Information about the {command} command \n `<>`: Optional, `[]`: Required, `{}`: Required if not linked';
base.strings.noOptions = 'This command does not require any options';
base.strings.commands = 'Commands';
base.strings.help = 'Help';
base.strings.helpDescription = '/help <command> for more info on a specific command';
base.strings.stats = 'Stats';
base.strings.system = 'System';
base.strings.utility = 'Utility';
base.strings.description = 'Description';
base.strings.options = 'Options';
base.strings.usage = 'Usage';
base.strings.example = 'Example';
base.strings.creator = 'Creator';
base.strings.invitationLink = 'Invite the bot on your server';
base.strings.voteLink = 'Vote for the bot';
base.strings.serverLink = 'Official support server';
base.strings.accountLinked = 'Account linked';
base.strings.invite = 'Invite';
base.strings.inviteDescription = `Hey {discord} you can invite me by clicking on the following link!\n${ invite }`;
base.strings.join = 'Join';
base.strings.joinDescription = `Hey {discord} you can join the support server by clicking on the following link!\n${ join }`;
base.strings.selectMatchBelow = 'Select one of the matches below';
base.strings.lastMatchLabel = 'Last match stats info';
base.strings.lastMatchDescription = 'Info about the last match';
base.strings.selectAnotherMatch = 'Select another match';
base.strings.lastStatsLabel = 'Statistics of the last matches';
base.strings.selectMap = 'Select a map';
base.strings.selectMapDescription = 'Select one of the following maps to get the statistics related ({playerName})';
base.strings.selectWeek = 'Select a week';
base.strings.year = 'Year';
base.strings.selectYear = 'Select a year';
base.strings.selectMonth = 'Select a month';
base.strings.loading = 'Loading';
base.strings.pagination = {
  prev: 'Попередня сторінка',
  next: 'Наступна сторінка',
  first: 'Перша сторінка',
  last: 'Остання сторінка'
};
base.strings.donate = 'Support the project';
base.strings.translation = 'Help with the translation';
base.strings.fullHistory = 'Full history';
base.error.user.missing = 'It seems like there is a user missing';
base.error.user.compareSame = 'You can\'t compare the same user';
base.error.user.excluded = 'You can\'t exclude a player you are searching for';
base.error.user.teamOwn = 'You don\'t own a team';
base.error.user.noTeam = 'You don\'t own a team and you aren\'t part of any team';
base.error.user.teamFull = 'You can\'t add more than 5 users to your team';
base.error.user.alreadyInTeam = '**{playerName}** is already part of the team **{teamName}**';
base.error.user.notInTeam = '**{playerName}** is not part of the team **{teamName}**';
base.error.user.permissions = { manageRoles: 'You don\'t have the permission to manage roles' };
base.error.user.notLinked = '{discord} is not linked to any faceit account';
base.error.user.noParametersNoLink = 'Please specify a user or a team\nYou can also link your discord account with your faceit account to get your stats directly\nTo know how to do it, type `/help command: link`';
base.error.user.noMatches = 'Couldn\'t find any matches for the player **{playerName}**';
base.error.user.lastMatchNoStats = 'Couldn\'t find any stats for the last match of the player **{playerName}**';
base.error.user.noMatchFoundWithOthers = 'Couldn\'t find any matches where **{playerName}** played with the requested players';
base.error.user.noBotLink = 'Sorry, but bots aren\'t really my type';
base.error.user.globalLink = '{discord} already has a global link';
base.error.user.notFound = 'The requested user is not on this server';
base.error.user.mapNotPlayed = 'The player **{playerName}** hasn\'t played on this map';
base.error.execution.command = 'An error occurred while executing the command';
base.error.execution.selectmenu = 'An error occurred while executing the select menu';
base.error.execution.button = 'An error occurred while executing the button';
base.error.execution.contextmenu = 'An error occurred while executing the context menu';
base.error.bot.channelNotAccessible = 'I do not have the permission to send messages in this channel';
base.error.bot.messageEvent = 'Please use the slash commands (/)';
base.error.bot.manageRoles = 'I don\'t have the permission to manage roles';
base.error.command.notFound = 'Command not found';
base.error.command.teamNameAlreadyExist = 'A team with this name already exists';
base.error.command.teamNameTooLong = `The team name is too long, it must be under ${ maxLengthTeamName } characters`;
base.error.command.alreadyOwnTeam = 'You already own the team **{teamName}**';
base.error.command.invalidRoles = 'One or more roles are invalid';
base.error.command.roleTooHigh = 'This role is higher than the bot role, please place it below the bot role';
base.error.command.teamNotFound = 'This team doesn\'t exist';
base.error.command.teamEmpty = 'This team doesn\'t have any members';
base.error.command.teamNoAccess = 'You don\'t have access to this team';
base.error.command.faceitProfileNotFound = 'Faceit profile not found';
base.error.command.faceitDatasNotFound = 'Faceit datas not found';
base.error.command.faceitCsgoStatsNotFound = 'Faceit csgo stats not found';
base.error.command.faceitHistoryNotFound = 'Faceit history not found';
base.error.command.faceitMatchStatsNotFound = 'Faceit match stats not found';
base.error.command.faceitLadderNotFound = 'Faceit ladder not found';
base.error.command.steamIdInvalid = 'Steam id invalid';
base.success.command.removeRoles = 'The roles have been removed successfully';
base.success.command.generateRoles = 'The roles have been generated successfully';
base.success.command.setupRoles = 'The roles have been setup successfully';
base.success.command.removeTeam = 'Your team **{teamName}** has been removed successfully';
base.success.command.updateTeam = 'Your team **{teamName}** has been updated';
base.success.command.createTeam = 'Your team **{teamName}** has been created';
base.success.command.removeUser = '**{playerName}** has been removed from the team **{teamName}**';
base.success.command.addUser = '**{playerName}** has been added to the team **{teamName}**';
base.success.command.unlink = {
  global: 'Ваш обліковий запис успішно відв’язано',
  server: 'Ваш обліковий запис успішно від’єднано на цьому сервері'
};
base.success.command.link = '{discord} було прив’язано з **{playerName}**';
module.exports = base;