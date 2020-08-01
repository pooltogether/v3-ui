import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const ExecuteWithdrawInstantNoFee = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props
  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const txName = `Withdraw ${quantity} tickets ($${quantity} ${ticker})`

  const [sendTx] = useSendTransaction(txName)

  const [txExecuted, setTxExecuted] = useState(false)

  const updateParamsAndNextStep = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { withdrawType: 'instantNoFee' })

    nextStep()
  }


  const method = 'withdrawInstantlyFrom'

  
  const [txId, setTxId] = useState()

  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      const sponsoredExitFee = '0'
      const maxExitFee = '1'

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        ethers.utils.parseEther(sponsoredExitFee),
        ethers.utils.parseEther(maxExitFee),
        {
          gasLimit: 500000
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


  // let tx
  // console.log({ txId})
  // const { data, loading, error } = useQuery(transactionQueryById, {
  //   variables: {
  //     id: txId
  //   },
  //   skip: !txId
  // })
  // console.log({ data, loading, error })
  // if (data) {
  //   console.log('found tx with id: ', txId)
  //   tx = data.tx
  // }

  // let tx

  
  // const { completeAllTodos, setVisibilityFilter, clearCompletedTodos } = todoMutations

  // useEffect(() => {
  //   console.log({ data })
  //   if (data && txId) {
  //     const transaction = data.transactions.find(transaction => transaction.id === txId)

  //     if (transaction) {
  //       setTx(transaction)
  //       console.log('found tx with id: ', txId)
  //     } else {
  //       console.log('COULD NOT FIND tx with id: ', txId)
  //     }
  //   }
  // }, [tx])

  const transactionsQueryResult = useQuery(transactionsQuery, {
    variables: {
      method
    }
  })
  const transactions = transactionsQueryResult.data.transactions
  console.log({ transactions})
  console.log({ txId})
  let tx
  if (transactions) {
    tx = transactions.find((todo) => todo.id === txId)
  }
  // const tx = todosVar()
  //   .map((todo: Todo) => todo.id === id ? { ...todo, text } : todo);
  console.log({ tx })


  useEffect(() => {
    console.log({txUpdate: { ...tx }})
    if (tx?.cancelled || tx?.error) {
      console.log('prevStep')
      previousStep()
    } else if (tx?.completed) {
      updateParamsAndNextStep()
    }
  }, [tx])



  return <>
    <PaneTitle small>
      {tx?.inWallet && txName}
    </PaneTitle>

    <PaneTitle>
      {tx?.sent && 'Withdrawal confirming ...'}
      {tx?.inWallet && 'Confirm withdrawal'}
    </PaneTitle>

    {tx?.sent && !tx?.completed && <>
      <div className='mx-auto -mb-2'>
        <V3LoadingDots />
      </div>

      <PaneTitle small>
        Transactions may take a few minutes
      </PaneTitle>

      <div
        className='text-inverse'
      >
        <span
          className='font-bold'
        >
          Estimated wait time:
        </span> PUT actual estimate here?
      </div>

    </>}
  </>
}
