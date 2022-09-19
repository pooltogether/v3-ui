import { NavigationContainer, NavigationLink } from '@pooltogether/react-components'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const navLinks = [
  {
    i18nKey: 'deposits',
    externalHref: 'https://app.pooltogether.com/account'
  },
  {
    i18nKey: 'rewards',
    externalHref: 'https://tools.pooltogether.com/token-faucet'
  },
  {
    i18nKey: 'v3',
    href: '/',
    regex: /^\//
  }
]

export const Navigation: React.FC<{ className?: string }> = (props) => {
  const { className } = props
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <NavigationContainer className={className}>
      {navLinks.map((link) => (
        <NavigationLink
          {...link}
          key={`nav-${link.i18nKey}`}
          t={t}
          Link={Link}
          pathname={router.pathname}
          selectedClassName='bg-pt-teal'
        />
      ))}
    </NavigationContainer>
  )
}
