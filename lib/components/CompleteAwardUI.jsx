import React, { useContext, useState } from 'react'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
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
      gasLimit: 600000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    'completeAward',
    params,
    'Complete Award',
  )
}

export const CompleteAwardUI = (props) => {
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

    handleCompleteAwardSubmit(
      setTx,
      provider,
      props.poolAddresses.prizePool,
    )
  }

  return <>
    {!txInFlight ? <>
      {genericChainData.canCompleteAward && <>
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

