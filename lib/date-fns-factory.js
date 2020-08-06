import { format } from 'date-fns'

export const poolFormat = (date, currentLang = 'en', formatStr = 'PP') => {
  let locale

  if (currentLang === 'zh') {
    locale = require('date-fns/locale/zh-CN')
  } else if (currentLang === 'de') {
    locale = require('date-fns/locale/de')
  } else if (currentLang === 'es') {
    locale = require('date-fns/locale/es')
  } else if (currentLang === 'it') {
    locale = require('date-fns/locale/it')
  } else if (currentLang === 'ja') {
    locale = require('date-fns/locale/ja')
  } else if (currentLang === 'hr') {
    locale = require('date-fns/locale/hr')
  } else if (currentLang === 'tr') {
    locale = require('date-fns/locale/tr')
  } else if (currentLang === 'ko') {
    locale = require('date-fns/locale/ko')
  } else {
    locale = require('date-fns/locale/en-GB')
  }

  // our Spanish community rep asked for days to be before month names
  if (currentLang === 'es') {
    formatStr = 'do MMMM yyyy'
  }

  // by providing a default string of 'PP' or any of its variants for `formatStr`
  // it will format dates in whichever way is appropriate to the locale
  return format(
    date,
    formatStr,
    {
      locale: locale.default
    }
  )
}