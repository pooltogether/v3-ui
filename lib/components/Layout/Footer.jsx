import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tagline } from '@pooltogether/react-components'

export const Footer = (props) => {
  const { t } = useTranslation()
  return (
    <div className='mb-96'>
      {' '}
      <Tagline>{t('theMoreYouPoolTagline')}</Tagline>
    </div>
  )
}
