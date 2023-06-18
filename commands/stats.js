const { color } = require('../config.json')
const Discord = require('discord.js')
const Graph = require('../functions/graph')
const CustomType = require('../templates/customType')
const CustomTypeFunc = require('../functions/customType')
const Options = require('../templates/options')
const { getCardsConditions } = require('../functions/commands')
const { getTranslation, getTranslations } = require('../languages/setup')
const { getStats, getLadder } = require('../functions/apiHandler')

const sendCardWithInfo = async (interaction, playerParam, type = CustomType.TYPES.ELO) => {
  const maxMatch = 20

  const {
    playerDatas,
    steamDatas,
    playerStats,
    playerHistory,
    playerLastStats
  } = await getStats({
    playerParam,
    matchNumber: maxMatch,
    checkElo: 1
  })

  const playerId = playerDatas.player_id
  const playerCountry = playerDatas.country
  const playerRegion = playerDatas.games.csgo.region
  const ladderCountry = await getLadder({
    playerParam,
    region: playerRegion,
    country: playerCountry
  })
  const ladderRegion = await getLadder({
    playerParam,
    region: playerRegion,
  })
  const faceitElo = playerDatas.games.csgo.faceit_elo
  const buttonValues = {
    id: 'uSG',
    s: playerId,
    u: interaction.user.id
  }

  const graphBuffer = Graph.generateChart(interaction, playerDatas.nickname, playerHistory, maxMatch, type)

  const faceitLevel = playerDatas.games.csgo.skill_level
  const size = 40

  const rankImageCanvas = await Graph.getRankImage(faceitLevel, faceitElo, size)

  const card = new Discord.EmbedBuilder()
    .setAuthor({
      name: playerDatas.nickname,
      iconURL: playerDatas.avatar || null,
      url: `https://www.faceit.com/en/players/${playerDatas.nickname}`
    })
    .setDescription(`[Steam](https://steamcommunity.com/profiles/${playerDatas.games.csgo.game_player_id}), [Faceit](https://www.faceit.com/en/players/${playerDatas.nickname})`)
    .setThumbnail(`attachment://${faceitLevel}level.png`)
    .addFields(
      { name: 'Games', value: `${playerStats.lifetime.Matches} (${playerStats.lifetime['Win Rate %']}% Win)`, inline: true },
      { name: 'K/D', value: playerStats.lifetime['Average K/D Ratio'], inline: true },
      { name: 'HS', value: `${playerStats.lifetime['Average Headshots %']}%`, inline: true },
      { name: 'Elo', value: playerLastStats['Current Elo'], inline: true },
      { name: `:flag_${playerCountry.toLowerCase()}:`, value: ladderCountry.position.toString(), inline: true },
      { name: `:flag_${playerRegion.toLowerCase()}:`, value: ladderRegion.position.toString(), inline: true }
    )
    .setImage('attachment://graph.png')
    .setColor(color.levels[faceitLevel].color)
    .setFooter({ text: `Steam: ${steamDatas?.personaname || steamDatas}` })

  return {
    content: ' ',
    embeds: [card],
    files: [
      new Discord.AttachmentBuilder(graphBuffer, { name: 'graph.png' }),
      new Discord.AttachmentBuilder(rankImageCanvas, { name: `${faceitLevel}level.png` })
    ],
    components: [
      new Discord.ActionRowBuilder()
        .addComponents([
          CustomTypeFunc.generateButtons(
            interaction,
            { ...buttonValues, n: 1 },
            CustomType.TYPES.KD,
            type === CustomType.TYPES.KD),
          CustomTypeFunc.generateButtons(
            interaction,
            { ...buttonValues, n: 2 },
            CustomType.TYPES.ELO,
            type === CustomType.TYPES.ELO),
          CustomTypeFunc.generateButtons(
            interaction,
            { ...buttonValues, n: 3 },
            CustomType.TYPES.ELO_KD,
            type === CustomType.TYPES.ELO_KD)
        ])
    ]
  }
}

module.exports = {
  name: 'stats',
  options: Options.stats,
  description: getTranslation('command.stats.description', 'en-US'),
  descriptionLocalizations: getTranslations('command.stats.description'),
  usage: Options.usage,
  type: 'stats',
  async execute(interaction) {
    return getCardsConditions(interaction, sendCardWithInfo)
  }
}

module.exports.sendCardWithInfo = sendCardWithInfo
