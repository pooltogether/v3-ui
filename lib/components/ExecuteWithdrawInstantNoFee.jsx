import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteWithdrawInstantNoFee = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props

  const txName = `Withdraw ${quantity} tickets`

  const [sendTx, tx] = useSendTransaction(txName)
  console.log({sendTx, tx})

  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const {
    underlyingCollateralSymbol,
    underlyingCollateralDecimals,
    poolAddress,
  } = pool

  const ticker = pool && underlyingCollateralSymbol
  const controlledTokenAddress = pool && pool.ticket

  const [sponsoredExitFee, setSponsoredExitFee] = useState('0')
  const [maxExitFee, setMaxExitFee] = useState('1')

  const [txExecuted, setTxExecuted] = useState(false)

  // const [tx, setTx] = useState({})

  // const txInWallet = tx.inWallet && !tx.sent
  // const txSent = tx.sent && !tx.completed
  // const txCompleted = tx.completed
  // const txError = tx.error

  // const ready = txCompleted && !txError

  


  const updateParamsAndNextStep = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { withdrawType: 'instantNoFee' })

    nextStep()
  }

  useEffect(() => {
    if (tx.cancelled || tx.error) {
      previousStep()
    } else if (tx.completed) {
      updateParamsAndNextStep()
    }
  }, [tx])





  const method = 'withdrawInstantlyFrom'
  const params = [
    usersAddress,
    ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    ),
    controlledTokenAddress,
    ethers.utils.parseEther(sponsoredExitFee),
    ethers.utils.parseEther(maxExitFee),
    {
      gasLimit: 500000
    }
  ]

  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      await sendTx(
        provider,
        poolAddress,
        PrizePoolAbi,
        method,
        params,
        'Withdraw'
      )
    }

    if (!txExecuted && quantity && underlyingCollateralDecimals) {
      runTx()
    }
  }, [quantity, underlyingCollateralDecimals])


  return <>
    <PaneTitle small>
      {tx.inWallet && txName}
    </PaneTitle>

    <PaneTitle>
      {tx.sent && 'Withdrawal confirming ...'}
      {tx.inWallet && 'Confirm withdrawal'}
    </PaneTitle>

    {tx.sent && !tx.completed && <>
      <div className='mx-auto -mb-2'>
        <V3LoadingDots />
      </div>

      <PaneTitle small>
        Transactions may take a few minutes
      </PaneTitle>

      <div
        className='text-inverse'
      >
        <span
          className='font-bold'
        >
          Estimated wait time:
        </span> PUT actual estimate here?
      </div>

    </>}
  </>
}
