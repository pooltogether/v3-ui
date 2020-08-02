import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { TxMessage } from 'lib/components/TxMessage'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const DepositCryptoForm = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity
  
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, genericChainData, usersChainData } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const tokenAddress = pool?.underlyingCollateralToken
  const ticker = pool?.underlyingCollateralSymbol
  
  const tickerUpcased = ticker?.toUpperCase()
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const {
    isRngRequested,
  } = genericChainData || {}
  const poolIsLocked = isRngRequested

  let quantityBN = ethers.utils.bigNumberify(0)
  if (decimals) {
    quantityBN = ethers.utils.parseUnits(
      quantity || '0',
      Number(decimals)
    )
  }

  const haveTokenAllowance = usersChainData?.usersTokenAllowance

  const usersBalanceBN = haveTokenAllowance ?
    usersChainData?.usersTokenBalance :
    ethers.utils.bigNumberify(0)

  let usersBalance
  if (decimals) {
    usersBalance = Number(
      ethers.utils.formatUnits(
        usersBalanceBN,
        Number(decimals)
      )
    )
  }

  const disabled = !haveTokenAllowance ||
    quantityBN.gt(usersChainData.usersTokenAllowance)

  // const [tx, setTx] = useState({})
  const [cachedUsersBalance, setCachedUsersBalance] = useState(usersBalance)


  // const handleResetState = (e) => {
  //   e.preventDefault()
  //   setTx({})
  // }

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  useEffect(() => {
    setCachedUsersBalance(usersBalance)
  }, [usersBalance])

  let overBalance = false
  if (decimals) {
    overBalance = quantity && usersBalanceBN.lt(
      ethers.utils.parseUnits(
        quantity,
        Number(decimals)
      )
    )
  }



  const [txId, setTxId] = useState()

  const txName = `Approve ${ticker}`
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((todo) => todo.id === txId)

  const txInFlight = tx?.inWallet || tx?.sent

  const handleUnlockClick = (e) => {
    e.preventDefault()

    const params = [
      poolAddress,
      ethers.utils.parseUnits(
        quantity,
        Number(decimals)
      ),
      {
        gasLimit: 200000
      }
    ]

    const id = sendTx(
      provider,
      IERC20Abi,
      tokenAddress,
      method,
      params,
    )
    
    setTxId(id)
  }

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      // previousStep()
    } else if (tx?.completed) {
      // updateParamsAndNextStep()
    }
  }, [tx])





  if (!pool) {
    return null
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Deposit using {tickerUpcased} <PoolCurrencyIcon
        pool={pool}
      />
    </PaneTitle>

    <DepositAndWithdrawFormUsersBalance
      start={cachedUsersBalance || usersBalance}
      end={usersBalance}
    />

    <div
      className='flex text-inverse items-center justify-between w-9/12 sm:w-7/12 lg:w-1/3 mx-auto border-l-2 border-r-2 border-b-2 p-3 font-bold'
    >
      <div>
        Total:
      </div>
      <div>
        <span
          className='font-number'
        >
          {quantity}
        </span> {tickerUpcased}
      </div>
    </div>

    {poolIsLocked && <FormLockedOverlay
      title='Deposit'
    >
      <div>
        The Pool is currently being awarded. No deposits or withdrawals can be processed until it's complete in:
{/* locked         */} (You do not need to refresh the page)
      </div>
    </FormLockedOverlay>}

    <div className='flex flex-col mx-auto'>
      
      {overBalance ? <>
        <div className='text-yellow my-6 flex flex-col'>
          <div
            className='font-bold'
          >
            You don't have enough {tickerUpcased}.
          </div>
          
          <div
            className='mt-2 text-default-soft'
          >
            <Button
              outline
            >
              Top up your balance
            </Button>
            <br/> (feature not done yet)
          </div>
        </div>
      </> : <>
          {disabled && <>
            <div className='w-full sm:w-9/12 mx-auto text-inverse mb-4 text-lg'>
              <div
                className='px-6 sm:px-10 text-sm'
              >
                <div
                  className='font-bold my-2 mt-10'
                >
                  Your approval is needed.
                </div>

                Unlock this deposit by allowing the pool's ticket contract to have a <span className='font-bold'>{quantity} {tickerUpcased}</span> allowance.
              </div>

              <div
                className='mt-3 sm:mt-5 mb-5'
              >
                <Button
                  wide
                  size='lg'
                  onClick={handleUnlockClick}
                  disabled={txInFlight}
                >
                  Unlock deposit
                </Button>
              </div>
            </div>
          </>}
      </>}

      {!disabled && <>
        <Button
          wide
          size='lg'
          onClick={handleDepositClick}
          color='white'
          className='mt-6 w-64 mx-auto'
          disabled={disabled}
        >
          Deposit
        </Button>
      </>}
    </div>
  </>
}
