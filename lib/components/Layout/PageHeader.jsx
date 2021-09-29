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
  ButtonLink,
  NavPoolBalance
} from '@pooltogether/react-components'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useTranslation } from 'react-i18next'

import { COOKIE_OPTIONS, SHOW_MANAGE_LINKS } from 'lib/constants'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'

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
  const { i18n: i18next, t } = useTranslation()
  const [currentLang, setCurrentLang] = useState(i18next.language)

  return (
    <SettingsItem label={t('language')}>
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
    <SettingsItem label={t('claim')} description={t('claimTokensOnBehalfOf')}>
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
    <SettingsItem label={t('manage')} tip={t('showPoolManagementDescription')}>
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
  const {
    isWalletConnected,
    provider,
    connectWallet,
    disconnectWallet,
    walletName,
    isOnboardReady,
    address: usersAddress,
    network: chainId,
    wallet
  } = useOnboard()
  const supportedNetworks = useEnvChainIds()
  const { t } = useTranslation()

  if (!isOnboardReady) return null

  if (!isWalletConnected) {
    return (
      <Button
        padding='px-4 sm:px-6 py-1'
        onClick={() => connectWallet()}
        textSize='xxxs'
        className='mx-1 my-auto'
      >
        {t('connectWallet')}
      </Button>
    )
  }

  return (
    <>
      <NetworkSelector
        t={t}
        wallet={wallet}
        chainId={chainId}
        isWalletConnected={isWalletConnected}
        supportedNetworks={supportedNetworks}
        className='mx-1 my-auto'
      />
      <NavPoolBalance usersAddress={usersAddress} className='mx-1 my-auto' />
      <Account
        t={t}
        className='mx-1 my-auto'
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        isWalletConnected={isWalletConnected}
        provider={provider}
        chainId={chainId}
        usersAddress={usersAddress}
        walletName={walletName}
      />
    </>
  )
}
