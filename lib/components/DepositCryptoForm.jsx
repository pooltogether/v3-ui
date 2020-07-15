import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TxMessage } from 'lib/components/TxMessage'
import { sendTx } from 'lib/utils/sendTx'

const handleUnlockSubmit = async (
  setTx,
  provider,
  contractAddress,
  prizePoolAddress,
  decimals,
  quantity,
) => {
  const params = [
    prizePoolAddress,
    // ethers.utils.parseUnits('1000000000', decimals),
    ethers.utils.parseUnits(quantity, decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    IERC20Abi,
    'approve',
    params,
    'Unlock Deposits',
  )
}

export const DepositCryptoForm = (props) => {
  const { nextStep } = props

  const [tx, setTx] = useState({})

  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const txInFlight = tx.inWallet || tx.sent

  const poolData = useContext(PoolDataContext)
  const { pool, usersChainData } = poolData

  const router = useRouter()
  const quantity = router.query.quantity

  const handleResetState = (e) => {
    e.preventDefault()

    setTx({})
  }

  const handleContinueClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  const ticker = pool && pool.underlyingCollateralSymbol

  const handleUnlockClick = (e) => {
    handleUnlockSubmit(
      setTx,
      provider,
      pool.underlyingCollateralToken,
      pool.id,
      pool.underlyingCollateralDecimals,
      quantity,
    )
  }

  if (usersChainData && usersChainData.usersTokenAllowance) {
    console.log(usersChainData.usersTokenAllowance.toString())
  } else {
    console.log({usersChainData})
  }
  const disabled = !usersChainData || 
    !usersChainData.usersTokenAllowance ||
    usersChainData.usersTokenAllowance.lte(0)

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Pay with {ticker.toUpperCase()}
    </PaneTitle>

    <div className='flex flex-col mx-auto'>

      {disabled && <>
        <div className='w-full sm:w-2/3 mx-auto text-inverse mb-4 text-lg'>
          <div
            className='px-6 sm:px-10'
          >
            <div className='font-bold my-2'>Your approval is needed.</div>
            Unlock this deposit by allowing the pool's ticket contract to have a <span className='font-bold'>{quantity} {ticker.toUpperCase()}</span> allowance.
          </div>

          <div
            className='mt-3 sm:mt-5 mb-5'
          >
            <Button
              onClick={handleUnlockClick}
              className='my-4 w-64'
              disabled={txInFlight}
            >
              Unlock deposit
            </Button>
          </div>
        </div>
      </>}

      {txInFlight && <>
        <TxMessage
          txType={`Unlock ${quantity} ${ticker.toUpperCase()} deposit`}
          tx={tx}
          handleReset={handleResetState}
        />
      </>}

      {!disabled && <>
        <Button
          onClick={handleContinueClick}
          color='white'
          className='mt-6 w-64 mx-auto'
          disabled={disabled}
        >
          Continue
        </Button>
      </>}
    </div>
  </>
}
