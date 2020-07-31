import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'

const handleWithFeeWithdraw = async (
  setTx,
  provider,
  contractAddress,
  usersAddress,
  controlledTokenAddress,
  quantity,
  withdrawType,
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
    const sponsoredExitFee = '0'
    const maxExitFee = '1'
    params.push(
      ethers.utils.parseEther(sponsoredExitFee),
      ethers.utils.parseEther(maxExitFee)
    )
  }

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

export const ExecuteWithdrawScheduledOrInstantWithFee = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const withdrawType = router.query.withdrawType

  if (!withdrawType) {
    console.log('massive error! We need the withdrawType ...')
    console.log('massive error! We need the withdrawType ...')
    console.log('massive error! We need the withdrawType ...')
  }

  const quantity = router.query.quantity
  const timelockDuration = router.query.timelockDuration
  const fee = router.query.fee
  const net = router.query.net
  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'

  let formattedFutureDate
  if (timelockDuration) {
    formattedFutureDate = formatFutureDateInSeconds(
      Number(timelockDuration)
    )
  }

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const {
    underlyingCollateralSymbol,
    underlyingCollateralDecimals,
    poolAddress,
  } = pool

  const ticker = underlyingCollateralSymbol
  const tickerUpcased = ticker && ticker.toUpperCase()
  const controlledTokenAddress = pool && pool.ticket

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

      handleWithFeeWithdraw(
        setTx,
        provider,
        poolAddress,
        usersAddress,
        controlledTokenAddress,
        quantity,
        withdrawType,
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

  const formattedWithdrawType = scheduledWithdrawal ? 'Schedule' : 'Instant'
  // yes this is different, read closely:
  const formattedWithdrawTypePastTense = scheduledWithdrawal ? 'Scheduled' : 'Instant'

  return <>
    <PaneTitle small>
      {txInWallet && `Withdraw ${quantity} tickets`}
    </PaneTitle>

    <PaneTitle>
      {txSent && `${formattedWithdrawType} Withdrawal confirming ...`}
      {txInWallet && `Confirm ${formattedWithdrawTypePastTense} Withdrawal`}
    </PaneTitle>

    <div className='text-white bg-yellow py-2 px-8 rounded-xl w-9/12 sm:w-2/3 mx-auto'>
      {scheduledWithdrawal ? <>
        <div className='font-bold'>
          Note:
        </div>
          You are scheduling to receive ${quantity} DAI and your funds will be ready for withdrawal in: <br />
          {formattedFutureDate}
        </> : <>
        <div className='font-bold'>
          Note:
        </div>
        You are withdrawing ${net} {tickerUpcased} of your funds right now, less the ${fee} {tickerUpcased} fairness fee
      </>}
    </div>
    

    {txSent && <>
      <TxMessage
        txType={`${formattedWithdrawType} Withdraw ${quantity} ${tickerUpcased}`}
        tx={tx}
        handleReset={handleResetState}
      />
    </>}
  </>
}
