import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const Breadcrumbs = () => {
  const router = useRouter()
  const { t } = useTranslation()

  if (router.pathname === '/') {
    return null
  }

  return (
    <Link href='/'>
      <a className='flex items-center absolute l-2 t-0 b-0 font-semibold hover:opacity-100 opacity-50 text-xxxs xs:text-xxs transition dark:text-white'>
        <FeatherIcon icon={'arrow-left-circle'} className='w-4 h-4 inline-block' />{' '}
        <span className='inline-block ml-1' style={{ paddingTop: 1 }}>
          {t('back')}
        </span>
      </a>
    </Link>
  )
}

interface PageTitleProps {
  title: string
}

export const PageTitle = (props: PageTitleProps) => {
  const { title } = props
  return (
    <div className='relative bg-pt-purple-lightest bg-opacity-50 dark:bg-opacity-60 dark:bg-pt-purple-bright py-4 px-4 text-center -mx-2 xs:mx-0 leading-none xs:rounded-lg mb-4 xs:mb-6'>
      <Breadcrumbs />
      <p className='my-0 mx-auto xs:text-lg'>{title || 'Apps'}</p>
    </div>
  )
}
