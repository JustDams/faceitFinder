const { ApplicationCommandOptionType } = require('discord.js')
const Options = require('../templates/options')
const { getUsers } = require('../functions/commands')
const { sendCardWithInfo } = require('./last')

const getOptions = () => {
  const options = [...Options.stats]
  options.unshift({
    name: 'player_aimed',
    description: 'steam_params / faceit_params / @user / empty if linked.',
    required: false,
    type: ApplicationCommandOptionType.String,
    slash: true
  })

  return options
}

module.exports = {
  name: 'find',
  options: getOptions(),
  description: 'Find the games that includes the player requested (up to 5), last 1000 games.',
  usage: `player_aimed:the history in which one you are searching AND ${Options.usage}`,
  type: 'stats',
  async execute(interaction) {
    const playerAimed = (await getUsers(interaction, 1, 'player_aimed', 'player_aimed', false))[0].param
    const users = (await getUsers(interaction, 5)).map(p => p.param)

    return sendCardWithInfo(interaction, playerAimed, null, 0, users.filter(e => e.normalize() !== playerAimed.normalize()))
  }
}