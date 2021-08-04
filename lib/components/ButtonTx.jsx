import React, { useEffect } from 'react'
import { omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@pooltogether/react-components'
import { useIsWalletOnNetwork, useUsersAddress } from '@pooltogether/hooks'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

export function ButtonTx(props) {
  const { children, chainId } = props
  const newProps = omit(props, ['usersAddress', 'chainId'])
  const isWalletConnected = useUsersAddress()
  const isWalletOnProperNetwork = useIsWalletOnNetwork(chainId)
  const disableButton = !isWalletConnected || !isWalletOnProperNetwork

  useEffect(() => {
    if (!chainId) {
      console.warn('ButtonTx requires a chainId')
    }
  }, [chainId])

  const { t } = useTranslation()

  return (
    <Tooltip
      isEnabled={disableButton}
      id={`button-tx-connect-wallet-tooltip`}
      title={t('connectAWallet')}
      tip={
        <Tip
          chainId={chainId}
          isWalletConnected={isWalletConnected}
          isWalletOnProperNetwork={isWalletOnProperNetwork}
        />
      }
    >
      <Button {...newProps} disabled={disableButton}>
        {children}
      </Button>
    </Tooltip>
  )
}

const Tip = (props) => {
  const { chainId, isWalletOnProperNetwork } = props
  const { t } = useTranslation()

  if (chainId && !isWalletOnProperNetwork) {
    return (
      <>
        <div className='my-2 text-xs sm:text-sm'>{t('youreOnTheWrongNetwork')}</div>
        <div className='my-2 text-xs sm:text-sm'>
          {t('pleaseConnectToNetwork', { network: getNetworkNiceNameByChainId(chainId) })}
        </div>
      </>
    )
  }

  return (
    <>
      <div className='my-2 text-xs sm:text-sm'>{t('noWalletConnected')}</div>
      <div className='my-2 text-xs sm:text-sm'>
        {t('pleaseConnectAWalletBeforeSendingTransactions')}
      </div>
    </>
  )
}
