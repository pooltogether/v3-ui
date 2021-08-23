import React, { useEffect } from 'react'
import { omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip, ThemedClipSpinner } from '@pooltogether/react-components'
import { useIsWalletOnNetwork, useUsersAddress } from '@pooltogether/hooks'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

export function ButtonTx(props) {
  const { children, chainId, tx } = props

  const { t } = useTranslation()

  const newProps = omit(props, ['usersAddress', 'chainId', 'tx'])
  const isWalletConnected = useUsersAddress()
  const isWalletOnProperNetwork = useIsWalletOnNetwork(chainId)
  const disableButton = !isWalletConnected || !isWalletOnProperNetwork

  useEffect(() => {
    if (!chainId) {
      console.warn('ButtonTx requires a chainId')
    }
  }, [chainId])

  const txInFlight = !tx?.cancelled && (tx?.sent || tx?.completed)

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
      <Button {...newProps} disabled={txInFlight || disableButton}>
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
