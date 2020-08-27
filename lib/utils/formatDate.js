import { fromUnixTime } from 'date-fns'

import { poolFormat } from 'lib/date-fns-factory'

const currentLang = 'en'

export const formatDate = (date, options = {}) => {
  if (!date) { return }

  let formatStr = 'MMM do, yyyy, HH:mm'

  if (options.short) {
    formatStr = 'MMM do, yyyy'
  }

  return poolFormat(
    fromUnixTime(date),
    currentLang,
    formatStr
  )
}
