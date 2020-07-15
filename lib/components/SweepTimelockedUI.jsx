import React, { useContext, useState } from 'react'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { SweepTimelockedForm } from 'lib/components/SweepTimelockedForm'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleSweepTimelockedSubmit = async (
  setTx,
  provider,
  contractAddress,
  usersAddress,
) => {
  const params = [
    [usersAddress],
    {
      gasLimit: 500000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    'sweep',
    params,
    'Sweep Timelocked Funds'
  )
}

export const SweepTimelockedUI = (props) => {
  const {
    usersChainData,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const {
    usersTimelockBalance,
    usersTimelockBalanceAvailableAt
  } = usersChainData || {}

  const userHasTimelockedFunds = usersTimelockBalance && usersTimelockBalance.gt(0)
  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <SweepTimelockedForm
        {...props}
        hasFundsToSweep={!userHasTimelockedFunds}
        usersTimelockBalance={usersTimelockBalance}
        usersTimelockBalanceAvailableAt={parseInt(usersTimelockBalanceAvailableAt, 10)}
        handleSubmit={(e) => {
          e.preventDefault()

          handleSweepTimelockedSubmit(
            setTx,
            provider,
            props.poolAddresses.prizePool,
            usersAddress,
          )
        }}
      />
    </> : <>
      <TxMessage
        txType='Sweep Timelocked Funds'
        tx={tx}
        handleReset={resetState}
      />
    </>}
    
  </>
}

