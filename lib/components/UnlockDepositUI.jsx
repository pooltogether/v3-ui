import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleUnlockSubmit = async (
  setTx,
  provider,
  contractAddress,
  prizePoolAddress,
  decimals,
) => {
  const params = [
    prizePoolAddress,
    ethers.utils.parseUnits('1000000000', decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    IERC20Abi,
    'approve',
    params,
    'Unlock Deposits',
  )
}

export const UnlockDepositUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <DepositForm
        {...props}
        disabled
        handleSubmit={(e) => {
          e.preventDefault()

          handleUnlockSubmit(
            setTx,
            provider,
            props.poolAddresses.token,
            props.poolAddresses.prizePool,
            props.genericChainData.underlyingCollateralDecimals
          )
        }}
      />
    </> : <>
      <TxMessage
        txType='Unlock Token Deposits'
        tx={tx}
        handleReset={resetState}
      />
    </>}
    
  </>
}

