import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'
import { poolToast } from 'lib/utils/poolToast'


const handleWithdraw = async (
  setTx,
  provider,
  contractAddress,
  quantity,
  withdrawType,
  decimals
) => {
  const params = [
    ethers.utils.parseUnits(quantity, decimals),
    [],
    {
      gasLimit: 500000
    }
  ]

  const method = withdrawType === 'instant' ?
    'redeemTicketsInstantly' :
    'redeemTicketsWithTimelock'

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    method,
    params,
    'Withdraw'
  )
}


export const NoFeeInstantWithdrawal = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const {
    id,
    underlyingCollateralSymbol,
    underlyingCollateralDecimals
  } = pool
  const poolAddress = id
  const ticker = pool && underlyingCollateralSymbol

  const [tx, setTx] = useState({})

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error

  let txExecuted = false

  const ready = txCompleted && !txError

  useEffect(() => {
    const runAsyncTx = () => {
      txExecuted = true
      handleWithdraw(
        setTx,
        provider,
        poolAddress,
        quantity,
        'instant',
        underlyingCollateralDecimals,
      )
    }
    if (!txExecuted && quantity) {
      runAsyncTx()
    }
  }, [quantity])

  useEffect(() => {
    if (tx.error) {
      previousStep()
    }
  }, [tx])

  useEffect(() => {
    if (ready) {
      nextStep()
    }
  }, [ready])

  const handleResetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    <PaneTitle small>
      Withdraw {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      {txSent && 'Withdrawal confirming ...'}
      {txInWallet && 'Confirm withdrawal'}
    </PaneTitle>

    {txSent && <>
      <PaneTitle small>
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
      </div>

      <TxMessage
        txType={`Withdraw ${quantity} ${ticker.toUpperCase()}`}
        tx={tx}
        handleReset={handleResetState}
      />
    </>}
  </>
}
