import React, { useContext, useState } from 'react'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
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
    genericChainValues
  } = props

  const magicContext = useContext(MagicContext)
  const walletContext = useContext(WalletContext)

  let provider = walletContext.state.provider
  if (!provider) {
    provider = magicContext.provider
  }
  
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
      {genericChainValues.canCompleteAward && <>
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

