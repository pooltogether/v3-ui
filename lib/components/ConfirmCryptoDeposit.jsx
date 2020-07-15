import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleDeposit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
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
    ethers.utils.parseUnits(quantity, decimals),
    [], // bytes calldata
    {
      gasLimit: 700000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    'mintTickets',
    params,
    'Deposit',
  )
}

export const ConfirmCryptoDeposit = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersChainData, genericChainData } = poolData

  const {
    isRngRequested,
  } = genericChainData || {}
  const poolIsLocked = isRngRequested

  const {
    id,
    underlyingCollateralSymbol,
    underlyingCollateralDecimals
  } = pool
  const poolAddress = id
  const ticker = pool && underlyingCollateralSymbol

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error

  const ready = txCompleted && !txError

  const handleDepositClick = (e) => {
    handleDeposit(
      setTx,
      provider,
      usersAddress,
      poolAddress,
      quantity,
      underlyingCollateralDecimals,
    )
  }

  const handleResetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      {txInFlight ? 'Deposit confirming ...' : 'Confirm deposit'}
    </PaneTitle>

    {poolIsLocked && <FormLockedOverlay
      title='Deposit'
    >
      <div>
        The Pool is currently being awarded. No deposits or withdrawals can be processed until it's complete in:
{/* locked         */} (You do not need to refresh the page)
      </div>
    </FormLockedOverlay>}

    {(!txInFlight && !ready) && <>
      <div
        className='mt-3 sm:mt-5 mb-5'
      >
        <Button
          onClick={handleDepositClick}
          className='my-4 w-64'
          disabled={txInFlight}
        >
          Make deposit
        </Button>
      </div>
    </>}


    {txInFlight && <>
      <PaneTitle small>
        Transactions may take a few minutes! Estimated wait time: 4 seconds
      </PaneTitle>

      <div className='mx-auto'>
        <V3LoadingDots />
      </div>

      <TxMessage
        txType={`Deposit ${quantity} ${ticker.toUpperCase()}`}
        tx={tx}
        handleReset={handleResetState}
      />
    </>}

    {ready && <>
      <PaneTitle small>
        Transaction complete!
      </PaneTitle>

      <Button
        onClick={handleContinueClick}
        color='white'
        className='mt-6 w-64 mx-auto'
      >
        Continue
      </Button>
    </>}
  </>
}
