import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig))
    }
  }
}

const Custom404 = () => {
  const { t } = useTranslation()

  return (
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <div className='content mx-auto max-w-sm' style={{ maxWidth: 700 }}>
        <div className='my-0 pt-32 px-2 xs:pt-32 space-y-4'>
          <h1 className=''>🤔</h1>
          <h2 className='dark:text-white'>404 - {t('pageNotFound', 'Page not found')}</h2>
          <h6 className='text-accent-1'>
            {t('lookingForSomethingElse', 'Looking for something else?')}
          </h6>
          <ErrorLinks />
        </div>
      </div>
    </div>
  )
}

export default Custom404

const ERROR_LINKS = Object.freeze([
  {
    i18nKey: 'home',
    href: 'https://pooltogether.com'
  },
  {
    i18nKey: 'app',
    href: 'https://app.pooltogether.com'
  },
  {
    i18nKey: 'forum',
    href: 'https://gov.pooltogether.com'
  },
  {
    i18nKey: 'userGuide',
    href: 'https://docs.pooltogether.com'
  },
  {
    title: 'Docs',
    href: 'https://dev.pooltogether.com'
  },
  { title: 'Discord', href: 'https://pooltogether.com/discord' }
])

export const ErrorLinks = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8'>
      {ERROR_LINKS.map((link) => (
        <a
          key={link.href}
          target='_blank'
          rel='noreferrer'
          href={link.href}
          className='flex hover:opacity-70 transition-opacity'
        >
          {link.i18nKey && t(link.i18nKey)}
          {link.title}
          <FeatherIcon icon={'external-link'} className='w-4 h-4 ml-2 my-auto' />
        </a>
      ))}
    </div>
  )
}
