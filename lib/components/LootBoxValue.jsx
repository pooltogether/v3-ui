import React from 'react'
import { isEmpty } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const LootBoxValue = (props) => {
  const { t } = useTranslation()

  const { awards } = props

  if (isEmpty(awards)) {
    return null
  }
  
  let lootBoxValueUSD = 0

  const erc20s = Object.keys(awards || {})
    .map(key => awards?.[key])

  erc20s?.forEach(award => {
    if (award.value) {
      lootBoxValueUSD += award.value
    }
  })

  return (
    <h3
      className='mb-1'
    >
      ${numberWithCommas(lootBoxValueUSD, { precision: 2 })} {t('value')}
    </h3>
  )
}
