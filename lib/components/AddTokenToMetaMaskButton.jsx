import React, { useContext } from 'react'

import PoolIcon from 'assets/images/pool-icon.svg'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { addTokenToMetaMask } from 'lib/services/addTokenToMetaMask'

export const AddTokenToMetaMaskButton = (props) => {
  const { showPoolIcon, tokenAddress, tokenSymbol, tokenDecimals } = props

  const { t } = useTranslation()
  const { walletName } = useContext(AuthControllerContext)

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
      className={`trans hover:opacity-70 inline-flex cursor-pointer flex items-center`}
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
