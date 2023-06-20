const noMention = require('../templates/noMention')
const errorCard = require('../templates/errorCard')
const { InteractionType } = require('discord.js')
const CommandsStats = require('../database/commandsStats')
const { getTranslation } = require('../languages/setup')
const errorHandler = require('../functions/error')

const editInteraction = (interaction, resp) => {
  if (!resp) return
  interaction.editReply(noMention(resp)).catch((error) => errorHandler(interaction, error))
}

const errorInteraction = (interaction, error, message) => {
  errorHandler(interaction, error)

  interaction.followUp(noMention(errorCard(typeof error !== 'string' ? message : error, interaction.locale)))
    .catch((error) => errorHandler(interaction, error))
}

const updateUser = (interaction, interactionEl, json = null) => {
  let values
  try {
    values = interactionEl.updateUser(interaction, json)
  } catch (error) {
    values = interactionEl.getJSON(interaction, json)
    values.u = interaction.user.id
  }

  return values
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    /**
     * Checking if the user is temporary banned
     * when the interaction is command or context menu
     */
    if (interaction.type === InteractionType.ApplicationCommand &&
      interaction.client.antispam.isIgnored(interaction.user.id, interaction.createdAt, interaction.channel)) return
    /**
     * Check if the channel is accessible
     */
    else if (!interaction.channel.permissionsFor(interaction.client.user).has('ViewChannel'))
      interaction
        .deferReply({ ephemeral: true })
        .then(() => {
          interaction
            .followUp({
              content: ' ',
              ...errorCard('error.bot.channelNotAccessible', interaction.locale),
            })
            .catch((error) => errorHandler(interaction, error))
        })
        .catch((error) => errorHandler(interaction, error))
    /**
     * Check if the interaction is a selectmenu
     */
    else if (interaction.isStringSelectMenu()) {
      const interactionSelectMenu = interaction.client.selectmenus?.get(interaction.customId)
      if (!interactionSelectMenu) return

      const values = interactionSelectMenu.getJSON(interaction)

      if (interaction.user.id === values.u)
        interaction
          .deferUpdate()
          .then(() => {
            CommandsStats.create(interaction.customId, 'selectmenu', interaction)
            interactionSelectMenu?.execute(interaction, values)
              .then(e => editInteraction(interaction, e))
              .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.selectmenu', interaction.locale)))
          })
          .catch((error) => errorHandler(interaction, error))
      else
        interaction
          .deferReply({ ephemeral: true })
          .then(() => {
            CommandsStats.create(interaction.customId, 'selectmenu', interaction)
            interactionSelectMenu?.execute(interaction, updateUser(interaction, interactionSelectMenu))
              .then(e => interaction.editReply(noMention(e)).catch((error) => errorHandler(interaction, error)))
              .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.selectmenu', interaction.locale)))
          })
          .catch((error) => errorHandler(interaction, error))
    }
    /**
     * Check if the interaction is a button
     */
    else if (interaction.isButton()) {
      const id = JSON.parse(interaction.customId)?.id
      const interactionButton = interaction.client.buttons?.get(id)
      if (!interactionButton) return

      const json = interactionButton.getJSON(interaction, JSON.parse(interaction.customId))

      if (interaction.user.id === json.u)
        interaction.deferUpdate().then(() => {
          interactionButton?.execute(interaction, json)
            .then(e => editInteraction(interaction, e))
            .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.button', interaction.locale)))
        }).catch((error) => errorHandler(interaction, error))
      else
        interaction.deferReply({ ephemeral: true }).then(() => {
          interactionButton?.execute(interaction, updateUser(interaction, interactionButton, json))
            .then(e => interaction.editReply(noMention(e)).catch((error) => errorHandler(interaction, error)))
            .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.button', interaction.locale)))
        }).catch((error) => errorHandler(interaction, error))
    }
    /**
     * Check if the interaction is a contextmenu
     */
    else if (interaction.type === InteractionType.ApplicationCommand && interaction.targetId !== undefined)
      interaction
        .deferReply()
        .then(() => {
          CommandsStats.create(interaction.commandName, 'contextmenu', interaction)
          interaction.client.contextmenus.get(interaction.commandName)?.execute(interaction)
            .then(resp => interaction
              .followUp(resp)
              .catch((error) => errorHandler(interaction, error)))
            .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.contextmenu', interaction.locale)))
        })
        .catch((error) => errorHandler(interaction, error))
    /**
     * Check if the interaction is a command
     */
    else if (interaction.client.commands.has(interaction.commandName)) {
      const command = interaction.client.commands.get(interaction.commandName)

      interaction
        .deferReply({ ephemeral: command.ephemeral })
        .then(() => {
          CommandsStats.create(interaction.commandName, 'command', interaction)
          command?.execute(interaction)
            .then(resp => {
              if (Array.isArray(resp))
                resp
                  .forEach(r => interaction
                    .followUp(r)
                    .catch((error) => errorHandler(interaction, error)))
              else
                interaction
                  .followUp(resp)
                  .catch((error) => errorHandler(interaction, error))
            })
            .catch(err => errorInteraction(interaction, err, getTranslation('error.execution.command', interaction.locale)))
        })
        .catch((error) => errorHandler(interaction, error))
    }
  }
}
