import React, { useContext, useState, useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { DepositTxButton } from 'lib/components/DepositTxButton'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export const DepositCryptoForm = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity
  
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersChainData } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const tokenAddress = pool?.underlyingCollateralToken
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  
  const tickerUpcased = ticker?.toUpperCase()

  const [needsApproval, setNeedsApproval] = useState(true)
  const [cachedUsersBalance, setCachedUsersBalance] = useState()

  const poolIsLocked = pool?.isRngRequested

  let quantityBN = ethers.utils.bigNumberify(0)
  if (decimals) {
    quantityBN = ethers.utils.parseUnits(
      quantity || '0',
      Number(decimals)
    )
  }

  const {
    usersBalanceBN,
    usersBalance,
    usersTokenAllowance,
  } = usersDataForPool(pool, usersChainData)

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
  const tx = transactions?.find((tx) => tx.id === txId)

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
      className='bg-primary flex text-inverse items-center justify-between w-full mx-auto px-6 py-3 font-bold rounded-bl-lg rounded-br-lg'
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

    <div
      className='flex flex-col mx-auto w-full mx-auto items-center justify-center'
    >
      
      {overBalance ? <>
        <div className='text-yellow my-6 flex flex-col'>
          <div
            className='font-bold'
          >
            You don't have enough {tickerUpcased}.
          </div>

          <ButtonDrawer>
            <Button
              textSize='xl'
              onClick={previousStep}
              className='px-4 mt-2 inline-flex items-center'
            >
              <FeatherIcon
                icon='arrow-left-circle'
                className='relative stroke-current w-4 h-4 sm:w-8 sm:h-8 mr-2'
                style={{
                  top: 1
                }}
              /> Change ticket quantity
            </Button>
          </ButtonDrawer>
          
          {/* <div

            className='mt-2 text-default-soft'
          >
            <Button
              textSize='xl'
              onClick={handleUnlockClick}
              disabled={unlockTxInFlight}
              className='w-48-percent'
            >
              Top up your balance
            </Button>
            <br/> (feature not done yet)
          </div> */}
        </div>
      </> : <>
        <div
          className='text-inverse mb-4 text-lg w-full'
        >

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
          
          <ButtonDrawer>
            {needsApproval && <>
              <Button
                noAnim
                textSize='xl'
                onClick={handleUnlockClick}
                disabled={unlockTxInFlight}
                className='w-48-percent'
              >
                Approve {tickerUpcased}
              </Button>
            </>}

            <DepositTxButton
              needsApproval={needsApproval}
              quantity={quantity}
              disabled={poolIsLocked || needsApproval || overBalance}
              poolIsLocked={poolIsLocked}
              nextStep={nextStep}
            />
          </ButtonDrawer>
        </div>
      </>}
    </div>
  </>
}
