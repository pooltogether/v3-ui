import React from 'react'

import { useTranslation } from 'next-i18next'

export function Tagline(props) {
  const { t } = useTranslation()

  return (
    <div className='text-accent-1 text-xxs xs:text-xs sm:text-base text-center mt-12 mb-64 opacity-60'>
      {t('theMoreYouPoolTagline')}
    </div>
  )
}
