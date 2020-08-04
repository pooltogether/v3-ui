import React, { useContext, useState, useEffect } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { DepositTxButton } from 'lib/components/DepositTxButton'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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
  const poolAddress = pool?.poolAddress
  
  const tickerUpcased = ticker?.toUpperCase()

  const [needsApproval, setNeedsApproval] = useState(true)
  const [cachedUsersBalance, setCachedUsersBalance] = useState(usersBalance)

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

  const usersTokenAllowance = usersChainData?.usersTokenAllowance ?
    usersChainData.usersTokenAllowance :
    ethers.utils.bigNumberify(0)

  const usersBalanceBN = usersChainData?.usersTokenBalance ?
    usersChainData.usersTokenBalance :
    ethers.utils.bigNumberify(0)

  let usersBalance = 0
  if (decimals) {
    usersBalance = Number(
      ethers.utils.formatUnits(
        usersBalanceBN,
        Number(decimals)
      )
    )
  }

  useEffect(() => {
    setCachedUsersBalance(usersBalance)
  }, [usersBalance])


  useEffect(() => {
    if (
      quantityBN.gt(0) &&
      usersTokenAllowance.gte(quantityBN)
    ) {
      setNeedsApproval(false)
    }
  }, [quantityBN, usersTokenAllowance])

  

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

  const txName = `Approve ${tickerUpcased}`
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((todo) => todo.id === txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleUnlockClick = async (e) => {
    e.preventDefault()

    const params = [
      poolAddress,
      ethers.utils.parseUnits('9999999999', Number(decimals)),
      // ethers.utils.parseUnits(
      //   quantity,
      //   Number(decimals)
      // ),
      {
        gasLimit: 200000
      }
    ]

    console.log(params)

    const id = sendTx(
      provider,
      IERC20Abi,
      tokenAddress,
      method,
      params,
    )
    
    setTxId(id)
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Deposit using {tickerUpcased} <div className='inline-block relative -t-1'>
        <PoolCurrencyIcon
          pool={pool}
        />
      </div>
    </PaneTitle>

    <DepositAndWithdrawFormUsersBalance
      bold={false}
      start={cachedUsersBalance || usersBalance}
      end={usersBalance}
      units={tickerUpcased}
    />

    <div
      className='flex text-inverse items-center justify-between w-full sm:w-9/12 lg:w-9/12 mx-auto border-l-2 border-r-2 border-b-2 p-3 font-bold'
    >
      <div>
        Total:
      </div>
      <div>
        <span
          className='font-number'
        >
          {numberWithCommas(quantity)}
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

    <div className='flex flex-col mx-auto w-full sm:w-9/12 lg:w-9/12 mx-auto items-center justify-center'>
      
      {overBalance ? <>
        <div className='text-yellow my-6 flex flex-col'>
          <div
            className='font-bold'
          >
            You don't have enough {tickerUpcased}.
          </div>
          
          {/* <div

            className='mt-2 text-default-soft'
          >
            <Button
              outline
            >
              Top up your balance
            </Button>
            <br/> (feature not done yet)
          </div> */}
        </div>
      </> : <>
        <div className='text-inverse mb-4 text-lg w-full'>

          {needsApproval && <>
            <div
              className='px-6 sm:px-10 text-sm'
              style={{
                minHeight: 97
              }}
            >
              <div
                className='font-bold my-2 mt-10'
              >
                {needsApproval && !unlockTxInFlight && 'Your approval is necessary'}

                {tx?.inWallet && !tx?.cancelled && 'Confirm approval'}
                {tx?.sent && !tx?.completed && 'Approval confirming...'}
              </div>

              {needsApproval && !unlockTxInFlight && <>
                Unlock this deposit by allowing the pool to have a <span className='font-bold'>{tickerUpcased}</span> allowance:
              </>}

              {/* {tx?.inWallet && !tx?.cancelled && 'Check your wallet'} */}
              {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage />}
              
              {/* Unlock this deposit by allowing the pool to have a <span className='font-bold'>{quantity} {tickerUpcased}</span> allowance: */}
            </div>
          </>}
          

          <div
            className='flex mt-10 sm:mt-10 mb-5 justify-between items-center'
          >
            {needsApproval && <>
              <Button
                wide
                size='lg'
                onClick={handleUnlockClick}
                disabled={unlockTxInFlight}
                className='w-49-percent'
              >
                Approve {tickerUpcased}
              </Button>
            </>}

            <DepositTxButton
              needsApproval={needsApproval}
              quantity={quantity}
              disabled={poolIsLocked || needsApproval || overBalance}
              nextStep={nextStep}
            />
          </div>
        </div>
      </>}
    </div>
  </>
}
