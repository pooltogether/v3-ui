import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  depositAmount,
  decimals
) => {
  if (
    !depositAmount
  ) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    return
  }

  const params = [
    usersAddress,
    ethers.utils.parseUnits(depositAmount, decimals),
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

export const DepositUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({})


  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({})
  }

  return <>
    <div
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-primary'
    >
      <div className='h-full flex flex-col justify-center p-4 sm:p-32 lg:p-64 text-center'>
        {!txInFlight ? <>
          <DepositForm
            {...props}
            genericChainValues={props.genericChainValues}
            handleSubmit={(e) => {
              e.preventDefault()
              handleDepositSubmit(
                setTx,
                provider,
                usersAddress,
                props.poolAddresses.prizePool,
                depositAmount,
                props.genericChainValues.tokenDecimals
              )
            }}
            vars={{
              depositAmount,
            }}
            stateSetters={{
              setDepositAmount,
            }}
          />
        </> : <>
          <TxMessage
            txType='Deposit to Pool'
            tx={tx}
            handleReset={resetState}
          />
        </>}
      </div>
    </div>
  </>
}

