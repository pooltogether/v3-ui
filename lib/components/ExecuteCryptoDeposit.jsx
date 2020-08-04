import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteCryptoDeposit = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txName = `Deposit ${quantity} tickets ($${quantity} ${ticker})`
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)



  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        {
          gasLimit: 550000
        }
      ]

      const id = sendTx(
        provider,
        PrizePoolAbi,
        poolAddress,
        method,
        params
      )
      setTxId(id)
    }

    if (!txExecuted && quantity && decimals) {
      runTx()
    }
  }, [quantity, decimals])
  
  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return <>
    <PaneTitle small>
      {txName}
    </PaneTitle>

    <PaneTitle>
      ${quantity} {tickerUpcased} = {quantity} tickets
    </PaneTitle>

    <ol className='mb-6'>
      <li
        className='mb-3'
      >
        1. Tickets are instant &amp; perpetual
      </li>
      <li
        className='mb-3'
      >
        2. 10 day minimum deposit length for fairness
      </li>
      <li
        className='mb-3'
      >
        3. Winnings are automatically added to your account
      </li>
    </ol>

    <PaneTitle>
      {tx?.inWallet && 'Confirm deposit'}
      {tx?.sent && 'Deposit confirming ...'}
    </PaneTitle>

    {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage />}
  </>
}
