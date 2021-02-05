import React from 'react'

import { useTranslation } from 'lib/../i18n'

export function DepositInfoList(props) {
  const { t } = useTranslation()

  return (
    <>
      <ol className='mb-6 text-highlight-3 text-sm'>
        <li className='mb-3'>{t('ticketsAreInstantAndPerpetual')}</li>
        {/* <li
        className='mb-3'
      >
        {t('tenDayMinimumForFairness')}
      </li> */}
        <li className='mb-3'>{t('winningsAutomaticallyAdded')}</li>
      </ol>
    </>
  )
}
