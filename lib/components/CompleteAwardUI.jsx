import React, { useContext, useState } from 'react'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleCompleteAwardSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 350000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    'completeAward',
    params,
    'Complete Award',
  )
}

export const CompleteAwardUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext
 
  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const { canCompleteAward, prizeStrategyAddress } = pool

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent && !tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleClick = (e) => {
    e.preventDefault()

    handleCompleteAwardSubmit(
      setTx,
      provider,
      prizeStrategyAddress,
    )
  }

  return <>
    {!txInFlight ? <>
      {canCompleteAward && <>
        <Button
          onClick={handleClick}
        >
          Complete Award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Complete Award'
        tx={tx}
        handleReset={resetState}
        resetButtonText='Hide this'
      />
    </>}
    
  </>
}

