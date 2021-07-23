import React from 'react'
import { omit } from 'lodash'
import { Button, Tooltip } from '@pooltogether/react-components'
import { useIsWalletOnNetwork, useUsersAddress } from '@pooltogether/hooks'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

export function ButtonTx(props) {
  const { children, chainId } = props
  const newProps = omit(props, ['usersAddress', 'chainId'])
  const isWalletConnected = useUsersAddress()
  const isWalletOnProperNetwork = useIsWalletOnNetwork(chainId)
  const disableButton = !isWalletConnected || !isWalletOnProperNetwork

  return (
    <Tooltip
      isEnabled={disableButton}
      id={`button-tx-connect-wallet-tooltip`}
      title='Connect a wallet'
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

  if (chainId && !isWalletOnProperNetwork) {
    return (
      <>
        <div className='my-2 text-xs sm:text-sm'>You are not on the proper network.</div>
        <div className='my-2 text-xs sm:text-sm'>
          Please connect to {getNetworkNiceNameByChainId(chainId)}.
        </div>
      </>
    )
  }

  return (
    <>
      <div className='my-2 text-xs sm:text-sm'>You do not have a wallet connected.</div>
      <div className='my-2 text-xs sm:text-sm'>
        Please connect a wallet before submitting transactions.
      </div>
    </>
  )
}
