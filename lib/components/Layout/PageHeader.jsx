import React, { useEffect, useState } from 'react'
import {
  Button,
  LanguagePickerDropdown,
  PageHeaderContainer,
  SettingsContainer,
  TestnetSettingsItem,
  ThemeSettingsItem,
  Account,
  NetworkSelector,
  SettingsItem,
  CheckboxInputGroup,
  ButtonLink
} from '@pooltogether/react-components'
import { useOnboard } from '@pooltogether/hooks'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { NavPoolBalance } from 'lib/components/Layout/NavPoolBalance'
import { useSupportedNetworks } from 'lib/hooks/useSupportedNetworks'
import Cookies from 'js-cookie'
import { COOKIE_OPTIONS, SHOW_MANAGE_LINKS } from 'lib/constants'

export const PageHeader = (props) => (
  <PageHeaderContainer Link={Link} as='/' href='/'>
    <UsersAccount />
    <Settings />
  </PageHeaderContainer>
)

const Settings = () => (
  <SettingsContainer className='ml-1 my-auto' title='Settings'>
    <LanguagePicker />
    <ThemeSettingsItem />
    <ClaimPoolTokens />
    <ManagePoolsSettingsItem />
    <TestnetSettingsItem />
  </SettingsContainer>
)

const LanguagePicker = () => {
  const { i18n: i18next } = useTranslation()
  const [currentLang, setCurrentLang] = useState(i18next.language)
  return (
    <SettingsItem label='Language'>
      <LanguagePickerDropdown
        currentLang={currentLang}
        changeLang={(newLang) => {
          setCurrentLang(newLang)
          i18next.changeLanguage(newLang)
        }}
      />
    </SettingsItem>
  )
}

const ClaimPoolTokens = () => {
  const { t } = useTranslation()
  return (
    <SettingsItem label='Claim POOL' description={t('claimTokensOnBehalfOf')}>
      <ButtonLink
        Link={Link}
        secondary
        textSize='xxxs'
        padding='px-6 py-2'
        shallow
        as='?claim=1'
        href='?claim=1'
        border='transparent'
        hoverBorder='transparent'
      >
        {t('openPoolClaim')}
      </ButtonLink>
    </SettingsItem>
  )
}

const ManagePoolsSettingsItem = () => {
  const { t } = useTranslation()

  const [showManageLinks, setShowManageLinks] = useState(false)
  useEffect(() => {
    const cookieShowAward = Cookies.get(SHOW_MANAGE_LINKS)
    setShowManageLinks(cookieShowAward)
  }, [])

  const handleShowManageLinksClick = (e) => {
    e.preventDefault()

    if (showManageLinks) {
      Cookies.remove(SHOW_MANAGE_LINKS, COOKIE_OPTIONS)
    } else {
      Cookies.set(SHOW_MANAGE_LINKS, 1, COOKIE_OPTIONS)
    }

    setShowManageLinks(!showManageLinks)
  }

  return (
    <SettingsItem label='Language'>
      <CheckboxInputGroup
        large
        id='settings-show-award'
        name='settings-show-award'
        label={t('showPoolManagementPages')}
        checked={showManageLinks}
        handleClick={handleShowManageLinksClick}
      />
    </SettingsItem>
  )
}

const UsersAccount = () => {
  const { isWalletConnected, connectWallet, isOnboardReady } = useOnboard()
  const supportedNetworks = useSupportedNetworks()

  if (!isOnboardReady) return null

  if (!isWalletConnected) {
    return (
      <Button
        padding='px-4 sm:px-6 py-1'
        onClick={() => connectWallet()}
        textSize='xxxs'
        className='mx-1 my-auto'
      >
        Connect wallet
      </Button>
    )
  }

  return (
    <>
      <NetworkSelector supportedNetworks={supportedNetworks} className='mx-1 my-auto' />
      <NavPoolBalance className='mx-1 my-auto' />
      <Account className='mx-1 my-auto' />
    </>
  )
}
