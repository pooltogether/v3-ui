import React, { useContext, useState } from 'react'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
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
    CompoundPeriodicPrizePoolAbi,
    'startAward',
    params,
    'Start Award',
  )
}

export const StartAwardUI = (props) => {
  const {
    genericChainData
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

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
      props.poolAddresses.prizePool,
    )
  }

  return <>
    {!txInFlight ? <>
      {genericChainData.canStartAward && <>
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

