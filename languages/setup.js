const { languages } = require('../config.json')

const keyReg = new RegExp(/^[a-zA-Z0-9]+\.[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/i)

const getTranslations = (key, replace) => {
  let languageObject = {}

  Object.keys(languages).forEach(language => {
    languageObject[language] = getTranslation(key, language, replace)
  })

  return languageObject
}

const getTranslation = (key, language, replace) => {
  let languageConf
  language = languages[language] || 'en-US'
  let string

  try {
    languageConf = require(`./${language}/translations`)
    string = languageConf[key]
    if (!string.length) throw new Error('Empty string')
  } catch (error) {
    languageConf = require('./en-US/translations')
    string = languageConf[key]
  }

  if (keyReg.test(key)) string = getStrings(key, languageConf)

  if (replace) Object.keys(replace).forEach(key => {
    let value = replace[key].toString()
    if (keyReg.test(value)) value = getStrings(value, languageConf)
    string = string.replace(`{${key}}`, value.toLowerCase())
  })

  return string
}

const getStrings = (key, languageConf) => key.split('.').reduce((acc, cur) => acc[cur], languageConf)

module.exports = {
  getTranslations,
  getTranslation,
  keyReg
}