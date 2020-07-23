import React, { useContext, useState } from 'react'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleStartAwardSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizeStrategyAbi,
    'startAward',
    params,
    'Start Award',
  )
}

export const StartAwardUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const { canStartAward, prizeStrategyAddress } = pool

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent && !tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleClick = (e) => {
    e.preventDefault()

    handleStartAwardSubmit(
      setTx,
      provider,
      prizeStrategyAddress,
    )
  }

  return <>
    {!txInFlight ? <>
      {canStartAward && <>
        <Button
          wide
          size='lg'
          onClick={handleClick}
        >
          Start Award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Start Award'
        tx={tx}
        handleReset={resetState}
        resetButtonText='Hide this'
      />
    </>}
    
  </>
}

