const { color } = require('../../config.json')
const Discord = require('discord.js')
const Player = require('../../functions/player')
const Steam = require('../../functions/steam')
const Graph = require('../../functions/graph')
const Match = require('../../functions/match')

const generatePlayerStats = async (playerHistory) => {
  const playerStats = {
    wins: 0,
    games: 0,
    'Average K/D': 0,
    'Average HS': 0,
    'Average MVPs': 0,
    'Average Kills': 0,
    'Average Deaths': 0,
    'Average Assists': 0,
  }

  for (const e of playerHistory) {
    playerStats.games += 1
    playerStats['Average HS'] += parseFloat(e.c4)
    playerStats['Average K/D'] += parseFloat(e.c2)
    playerStats['Average MVPs'] += parseFloat(e.i9)
    playerStats['Average Kills'] += parseFloat(e.i6)
    playerStats['Average Deaths'] += parseFloat(e.i8)
    playerStats['Average Assists'] += parseFloat(e.i7)
    playerStats.wins += Math.max(...e.i18.split('/').map(Number)) === parseInt(e.c5)
  } return playerStats
}

const getAverage = (q, d, fixe = 2, percent = 1) => { return ((q / d) * percent).toFixed(fixe) }

module.exports = {
  name: 'dateStatsSelector',
  async execute(interaction) {
    const { s, f, t, u, m } = JSON.parse(interaction.values)
    if (u !== interaction.user.id) return false
    
    const steamDatas = await Steam.getDatas(s)
    const playerId = await Player.getId(s)
    const playerDatas = await Player.getDatas(playerId)

    const faceitLevel = playerDatas.games.csgo.skill_level
    const faceitElo = playerDatas.games.csgo.faceit_elo
    const size = 40

    const playerHistory = await Match.getMatchElo(playerId, m)
    const playerStats = await generatePlayerStats(playerHistory.filter(e => e.date >= f && e.date < t))

    const canvaSize = playerStats.games + 1
    const today = new Date().setHours(24, 0, 0, 0)

    const elo = await Graph.getElo(canvaSize, playerHistory.filter(e => e.date < t), faceitElo,
      today >= f && today <= t)
    const graphCanvas = await Graph.generateCanvas(elo)
    const eloDiff = elo.at(-1) - elo.shift()

    const rankImageCanvas = await Graph.getRankImage(faceitLevel, faceitElo, size)

    const toRealTimeStamp = new Date(t).setHours(-24)

    const card = new Discord.MessageEmbed()
      .setAuthor(playerDatas.nickname, playerDatas.avatar, `https://www.faceit.com/fr/players/${playerDatas.nickname}`)
      .setTitle('Steam')
      .setURL(steamDatas.profileurl)
      .setThumbnail(`attachment://${faceitLevel}level.png`)
      .addFields(
        f !== toRealTimeStamp ?
          {
            name: 'From - To', value: [new Date(f).toDateString(), '-', new Date(toRealTimeStamp).toDateString()].join(' '),
            inline: false
          } :
          { name: 'From', value: new Date(f).toDateString(), inline: false },
        { name: 'Games', value: `${playerStats.games} (${getAverage(playerStats.wins, playerStats.games, 2, 100)}% Win)`, inline: true },
        { name: 'Elo', value: isNaN(eloDiff) ? '0' : eloDiff > 0 ? `+${eloDiff}` : eloDiff.toString(), inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Average K/D', value: getAverage(playerStats['Average K/D'], playerStats.games), inline: true },
        { name: 'Average HS', value: `${getAverage(playerStats['Average HS'], playerStats.games)}%`, inline: true },
        { name: 'Average MVPs', value: getAverage(playerStats['Average MVPs'], playerStats.games), inline: true },
        { name: 'Average Kills', value: getAverage(playerStats['Average Kills'], playerStats.games), inline: true },
        { name: 'Average Deaths', value: getAverage(playerStats['Average Deaths'], playerStats.games), inline: true },
        { name: 'Average Assists', value: getAverage(playerStats['Average Assists'], playerStats.games), inline: true })
      .setImage(`attachment://${s}graph.png`)
      .setColor(color.levels[faceitLevel].color)
      .setFooter(`Steam: ${steamDatas.personaname}`)

    return {
      embeds: [card],
      files: [
        new Discord.MessageAttachment(graphCanvas.toBuffer(), `${s}graph.png`),
        new Discord.MessageAttachment(rankImageCanvas.toBuffer(), `${faceitLevel}level.png`)
      ],
      components: [],
      content: null,
    }
  }
}