import React from 'react'

import { useTranslation } from 'react-i18next'

export function Tagline(props) {
  const { t } = useTranslation()

  return (
    <div className='text-accent-1 text-xxs xs:text-xs sm:text-base text-center mt-4 mb-64 px-4 opacity-60'>
      {t('theMoreYouPoolTagline')}
    </div>
  )
}
