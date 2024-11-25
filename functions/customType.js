const { ButtonBuilder } = require('discord.js')
const { getTranslation } = require('../languages/setup')
const Interaction = require('../database/interaction')
const CustomType = require('../templates/customType')

const updateOptionsType = (id, newType, jsonData = {}) => {
  Interaction.getOne(id).then(data => {
    const newJson = Object.assign({}, data.jsonData, jsonData, { type: newType })
    Interaction.updateOneWithJson(id, newJson)
  })
}

const buildButtons = (interaction, buttonsValues, types, disabledType = null) =>
  Promise.all(types.map((t) => generateButtons(interaction, buttonsValues, t, disabledType)))

const buildButtonsGraph = (interaction, buttonValues, type = CustomType.TYPES.ELO) => buildButtons(interaction, buttonValues, [
  CustomType.TYPES.KD,
  CustomType.TYPES.ELO,
  CustomType.TYPES.ELO_KD
], type)

const generateButtons = async (interaction, values, type, disabledType = null) => {
  let name = type.name
  if (type.translate) name = getTranslation(name, interaction.locale)

  const customId = (await Interaction.create(Object.assign({}, values, {
    type,
    userId: interaction.user.id
  }))).id

  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(name)
    .setStyle(type.style)
    .setDisabled(type.name === disabledType?.name)

  if (type.emoji) button.setEmoji(type.emoji)

  return button
}

const updateButtons = (components, type, jsonData = null) => {
  return components.map(button => {
    button = button.toJSON()
    const id = button.custom_id

    if (jsonData) updateOptionsType(id, CustomType.getTypeFromEmoji(button.emoji.name), jsonData)
    else Interaction.updateOne(id)

    const buttonBuilder = new ButtonBuilder()
      .setCustomId(id)
      .setLabel(button.label)
      .setEmoji(button.emoji)
      .setStyle(button.style)

    if (type) buttonBuilder.setDisabled(button.label === type.name)

    return buttonBuilder
  })
}

module.exports = {
  generateButtons,
  updateButtons,
  buildButtonsGraph,
  buildButtons,
  updateOptionsType
}