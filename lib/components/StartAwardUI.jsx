import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { callTransaction } from 'lib/utils/callTransaction'

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

  const {
    isRngCompleted,
    isRngRequested,
    canStartAward,
    canCompleteAward,
    prizeStrategyAddress
  } = pool
  // console.log({ canStartAward, canCompleteAward, isRngCompleted, isRngRequested,})

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

  // const { data, loading, error } = useQuery(transactionsQuery, {
  //   variables: {
  //     method: 'startAward'
  //   }
  // })
  // const disabled = data?.transactions?.[0]

  return <>
    {canStartAward && <>
      <Button
        wide
        size='lg'
        outline
        onClick={handleClick}
        disabled={disabled}
      >
        Start Award
      </Button>
    </>}

      {/* <TxMessage
        txType='Start Award'
        tx={tx}
        handleReset={resetState}
        resetButtonText='Hide this'
      /> */}
    
  </>
}

