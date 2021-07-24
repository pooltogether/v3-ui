import { PageTitleAndBreadcrumbs } from '@pooltogether/react-components'
import { PodsList } from 'lib/components/Pods/PodsList'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const Index = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <PageTitleAndBreadcrumbs
        title={t('pods')}
        description={t('podsDescription')}
        breadcrumbs={[]}
      />
      <PodsList className='mt-10' />
    </>
  )
}
