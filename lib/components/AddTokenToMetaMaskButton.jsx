import React from 'react'
import { useOnboard } from '@pooltogether/hooks'

import PoolIcon from 'assets/images/pool-icon.svg'

import { useTranslation } from 'react-i18next'
import { addTokenToMetaMask } from 'lib/services/addTokenToMetaMask'

export const AddTokenToMetaMaskButton = (props) => {
  const { showPoolIcon, tokenAddress, tokenSymbol, tokenDecimals } = props

  const { t } = useTranslation()
  const { walletName } = useOnboard()

  if (walletName !== 'MetaMask') {
    return null
  }

  const handleAddTokenToMetaMask = (e) => {
    e.preventDefault()
    addTokenToMetaMask(t, tokenSymbol, tokenAddress, tokenDecimals)
  }

  return (
    <a
      onClick={handleAddTokenToMetaMask}
      className={`trans hover:opacity-70 inline-flex cursor-pointer items-center`}
    >
      {showPoolIcon && <img src={PoolIcon} className='relative inline-block w-4 h-4 mx-2' />}
      {t('addTicketTokenToMetamask', {
        token: tokenSymbol
      })}
    </a>
  )
}

AddTokenToMetaMaskButton.defaultProps = {
  showPoolIcon: false
}
