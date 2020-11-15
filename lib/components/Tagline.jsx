import React from 'react'

import { useTranslation } from 'lib/../i18n'

export function Tagline(props) {
  const { t } = useTranslation()

  return <>
    <div
      className='text-center mt-12 opacity-60 pb-40'
    >
      <div
        className='text-accent-1 text-xxs xs:text-xs sm:text-base'
      >
        {t('theMoreYouPoolTagline')}
      </div>
      <p
        className='text-accent-1 mt-2 opacity-50 text-xxxxs xs:text-xxxs sm:text-xxs'
      >
        {t('poweredByCoingeckoAPI')}
      </p>
    </div>
  </>
}
