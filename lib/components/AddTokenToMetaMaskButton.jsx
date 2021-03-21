import React, { useContext } from 'react'

import PoolIcon from 'assets/images/pool-icon.svg'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { addTokenToMetaMask } from 'lib/services/addTokenToMetaMask'

export const AddTokenToMetaMaskButton = (props) => {
  const { basic, noAnim, textSize, showPoolIcon, tokenAddress, tokenSymbol, tokenDecimals } = props

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
    <Button
      basic={basic}
      noAnim={noAnim}
      textSize={textSize}
      onClick={handleAddTokenToMetaMask}
      className='font-bold mx-auto'
    >
      {showPoolIcon && (
        <img src={PoolIcon} className='relative inline-block w-4 h-4 mx-1' style={{ top: -2 }} />
      )}
      {t('addTicketTokenToMetamask', {
        token: tokenSymbol
      })}
    </Button>
  )
}

AddTokenToMetaMaskButton.defaultProps = {
  showPoolIcon: false
}
