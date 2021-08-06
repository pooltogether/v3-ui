import { PageTitleAndBreadcrumbs } from '@pooltogether/react-components'
import { PodsList } from 'lib/components/Pods/PodsList'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const Index = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <PageTitleAndBreadcrumbs title={t('pods')} breadcrumbs={[]} />
      <p className='text-accent-1'>{t('podsDescription')}</p>
      <PodsList className='mt-10' />
    </>
  )
}
