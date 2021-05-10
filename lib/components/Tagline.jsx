import React from 'react'

import { useTranslation } from 'lib/../i18n'

export function Tagline(props) {
  const { t } = useTranslation()

  return (
    <>
      <div className='text-center mt-12 mb-8 opacity-60'>
        <div className='text-accent-1 text-xxs xs:text-xs sm:text-base'>
          {t('theMoreYouPoolTagline')}
        </div>
      </div>
    </>
  )
}
