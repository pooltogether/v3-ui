import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleWithdraw = async (
  setTx,
  provider,
  contractAddress,
  usersAddress,
  controlledTokenAddress,
  quantity,
  withdrawType,
  sponsoredExitFee,
  maxExitFee,
  decimals
) => {
  const params = [
    usersAddress,
    ethers.utils.parseUnits(
      quantity,  
      Number(decimals)
    ),
    controlledTokenAddress,
  ]

  let method = 'withdrawWithTimelockFrom'
  if (withdrawType === 'instant') {
    method = 'withdrawInstantlyFrom'
    params.push(
      ethers.utils.parseEther(sponsoredExitFee),
      ethers.utils.parseEther(maxExitFee)
    )
  }
  console.log({ method })

  params.push({
    gasLimit: 500000
  })

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    method,
    params,
    'Withdraw'
  )
}


export const WithdrawRunInstantNoFee = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

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

  const [tx, setTx] = useState({})
  const [txExecuted, setTxExecuted] = useState(false)

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error

  const ready = txCompleted && !txError

  useEffect(() => {
    const runAsyncTx = () => {
      setTxExecuted(true)

      handleWithdraw(
        setTx,
        provider,
        poolAddress,
        usersAddress,
        controlledTokenAddress,
        quantity,
        'instant',
        sponsoredExitFee,
        maxExitFee,
        underlyingCollateralDecimals,
      )
    }

    if (!txExecuted && quantity) {
      runAsyncTx()
    }
  }, [quantity])


  const updateParamsAndNextStep = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { withdrawType: 'instantNoFee' })

    nextStep()
  }

  useEffect(() => {
    if (tx.error) {
      previousStep()
    }
  }, [tx])

  useEffect(() => {
    if (ready) {
      updateParamsAndNextStep()
    }
  }, [ready])

  const handleResetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    <PaneTitle small>
      {txInWallet && `Withdraw ${quantity} tickets`}
    </PaneTitle>

    <PaneTitle>
      {txSent && 'Withdrawal confirming ...'}
      {txInWallet && 'Confirm withdrawal'}
    </PaneTitle>

    {txSent && <>
      {/* <PaneTitle small>
        Transactions may take a few minutes!
      </PaneTitle> */}

      {/* <div
        className='text-inverse'
      >
        <span
          className='font-bold'
        >
          Estimated wait time:
        </span> 4 seconds
      </div> */}

      {/* <div className='mx-auto'>
        <V3LoadingDots />
      </div> */}

      <TxMessage
        txType={`Withdraw ${quantity} ${ticker.toUpperCase()}`}
        tx={tx}
        handleReset={handleResetState}
      />
    </>}
  </>
}
