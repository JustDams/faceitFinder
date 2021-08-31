const { name, vote, color } = require('../config.json')
const Discord = require('discord.js')

module.exports = {
  name: 'vote',
  aliasses: ['vote'],
  options: '',
  description: "Get the link to vote for the bot on top.gg",
  type: 'system',
  async execute(message, args) {
    message.channel.send(new Discord.MessageEmbed()
      .attachFiles([
        new Discord.MessageAttachment('./images/logo.png', 'logo.png')
      ])
      .setColor(color.primary)
      .setAuthor(`${name}`, 'attachment://logo.png')
      .setDescription(`Hey <@${message.author.id}> you can vote for me on the following link\n${vote}`)
      .setFooter(`${name} Vote`))
  }
}