const Discord = require('discord.js')
const Player = require('../functions/player')
const errorCard = require('../templates/errorCard')
const DateStats = require('../functions/dateStats')
const { getCardsConditions } = require('../functions/commands')
const CustomType = require('../templates/customType')
const Options = require('../templates/options')
const { getPageSlice, getMaxPage } = require('../functions/pagination')
const { getTranslation, getTranslations } = require('../languages/setup')

const getYear = date => {
  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  date.setDate(1)
  date.setMonth(0)
  return date.getTime()
}

const sendCardWithInfo = async (interaction, playerId, page = 0) => {
  const playerDatas = await Player.getDatas(playerId)
  const playerStats = await Player.getStats(playerId)

  const options = []
  const dates = await DateStats.getDates(playerId, playerStats.lifetime.Matches, getYear)

  dates.forEach(date => {
    const from = new Date(date.date)
    const to = new Date(date.date)
    to.setHours(24)
    to.setMonth(12)
    to.setDate(1)

    let option = new Discord.StringSelectMenuOptionBuilder()
      .setLabel(`${getTranslation('strings.year', interaction.locale)} ${from.getFullYear()}`)
      .setDescription(getTranslation('strings.matchPlayed', interaction.locale, { matchNumber: date.number }))
      .setValue(JSON.stringify({
        s: playerId,
        f: from.getTime() / 1000,
        t: to / 1000,
        u: interaction.user.id
      }))

    options.push(option)
  })

  const pages = getPageSlice(page)
  const pagination = options.slice(pages.start, pages.end)

  if (pagination.length === 0) return errorCard(getTranslation('error.user.noMatches', interaction.locale, {
    playerName: playerDatas.nickname
  }), interaction.locale)

  pagination[0] = DateStats.setOptionDefault(pagination.at(0))

  const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.StringSelectMenuBuilder()
        .setCustomId('dateStatsSelector')
        .setPlaceholder(getTranslation('strings.selectYear', interaction.locale))
        .addOptions(pagination))

  return DateStats.getCardWithInfo(interaction,
    row,
    JSON.parse(pagination[0].data.value),
    CustomType.TYPES.ELO,
    'uDSG',
    playerStats.lifetime.Matches,
    getMaxPage(options),
    page)
}

module.exports = {
  name: 'yearstats',
  options: Options.stats,
  description: getTranslation('command.yearstats.description', 'en-US'),
  descriptionLocalizations: getTranslations('command.yearstats.description'),
  usage: Options.usage,
  example: 'steam_parameters: justdams',
  type: 'stats',
  async execute(interaction) {
    return getCardsConditions(interaction, sendCardWithInfo)
  }
}

module.exports.sendCardWithInfo = sendCardWithInfo
