import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TxMessage } from 'lib/components/TxMessage'
import { poolToast } from 'lib/utils/poolToast'
import { useTransaction } from 'lib/hooks/useTransaction'
import { callTransaction } from 'lib/utils/callTransaction'

const handleDeposit = async (
  setTx,
  provider,
  contractAddress,
  usersAddress,
  controlledTokenAddress,
  quantity,
  decimals
) => {
  if (
    !quantity
  ) {
    poolToast.error(`Deposit Quantity needs to be filled in`)
    return
  }
  // debugger

  const params = [
    usersAddress,
    ethers.utils.parseUnits(
      quantity,
      Number(decimals)
    ),
    controlledTokenAddress,
    {
      gasLimit: 500000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    'depositTo',
    params,
    'Deposit',
  )
}

export const ConfirmCryptoDeposit = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const {
    poolAddress,
    underlyingCollateralSymbol,
    underlyingCollateralDecimals
  } = pool

  const ticker = pool && underlyingCollateralSymbol
  const controlledTokenAddress = pool && pool.ticket

  const [
    tx,
    setTx,
    txInWallet,
    txSent,
    txCompleted,
    txError,
    txSuccess,
  ] = useTransaction()

  useEffect(() => {
    const runAsyncTx = () => {
      handleDeposit(
        setTx,
        provider,
        poolAddress,
        usersAddress,
        controlledTokenAddress,
        quantity,
        underlyingCollateralDecimals,
      )
    }
    runAsyncTx()
  }, [])

  useEffect(() => {
    if (tx.error) {
      previousStep()
    }
  }, [tx])

  useEffect(() => {
    if (txSuccess) {
      nextStep()
    }
  }, [txSuccess])

  const handleResetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    <PaneTitle small>
      {txInWallet && `${quantity} tickets`}
    </PaneTitle>

    <PaneTitle>
      {txSent && 'Deposit confirming ...'}
      {txInWallet && 'Confirm deposit'}
    </PaneTitle>

    {txSent && <>
      {/* <PaneTitle small>
        Transactions may take a few minutes!
      </PaneTitle>

      <div
        className='text-inverse'
      >
        <span
          className='font-bold'
        >
          Estimated wait time:
        </span> 4 seconds
      </div>

      <div className='mx-auto'>
        <V3LoadingDots />
      </div> */}

      <TxMessage
        txType={`Deposit ${quantity} ${ticker.toUpperCase()}`}
        tx={tx}
        handleReset={handleResetState}
      />
    </>}
  </>
}
