const { color, name } = require('../config.json')
const Discord = require('discord.js')
const { getTranslation, keyReg } = require('../languages/setup')

module.exports = (description, lang) => {
  if (typeof description === 'string' && keyReg.test(description)) description = getTranslation(description, lang)

  return {
    embeds: [
      new Discord.EmbedBuilder()
        .setColor(color.error)
        .setDescription(description ?? getTranslation('error.execution.command', lang))
        .setFooter({ text: `${name} ${getTranslation('strings.error', lang)}` })
    ],
    files: []
  }
}