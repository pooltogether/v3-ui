import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'react-i18next'

import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

export const NetworkWarning = (props) => {
  const { t } = useTranslation()
  const { chainId, walletOnWrongNetwork } = props

  if (!walletOnWrongNetwork) return null

  return (
    <div className='flex flex-col justify-center items-center text-center mx-auto mb-4 sm:w-1/2'>
      <FeatherIcon icon='alert-circle' className='text-orange w-4 h-4 mr-2 my-auto' />
      <span className='text-xs text-orange'>
        {t('yourWalletIsOnTheWrongNetwork', { networkName: getNetworkNiceNameByChainId(chainId) })}
      </span>
    </div>
  )
}
