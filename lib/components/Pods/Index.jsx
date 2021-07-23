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
        description='Increase your chances of winning by grouping your deposit with others and splitting the prize'
        breadcrumbs={[]}
      />
      <PodsList className='mt-10' />
    </>
  )
}
