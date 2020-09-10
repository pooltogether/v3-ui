import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositInfoList } from 'lib/components/DepositInfoList'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteCryptoDeposit = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, refetchPlayerQuery } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txName = t(`depositAmountTickets`, {
    amount: quantity,
  })
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName, refetchPlayerQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)



  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      let referrerAddress = Cookies.get(REFERRER_ADDRESS_KEY)
      try {
        ethers.utils.getAddress(referrerAddress)
      } catch (e) {
        referrerAddress = null
        console.error(`referrer address was an invalid Ethereum address:`, e.message)
      }

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        [], // this will change from empty array (calldata) to `referrerAddress` after we update the contracts
        {
          gasLimit: 550000
        }
      ]

      const id = sendTx(
        t,
        provider,
        usersAddress,
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
      const valueInCentsWithDecimals = Number(quantity) * 100
      const valueInCents = parseInt(valueInCentsWithDecimals, 10)

      // console.log('value in cents', valueInCents)
      // console.log(window.fathom)
      if (window && window.fathom) {
        // console.log('send fathom')
        // this is naive as the user would have to stay on
        // the same page until the tx confirms, so it won't be accurate anyways
        // window.fathom.trackGoal('L4PBHM0U', valueInCents)
      }
      nextStep()
    }
  }, [tx])

  return <>
    <PaneTitle small>
      {txName}
    </PaneTitle>

    <PaneTitle>
      {t('forAmountTicker', {
        amount: quantity,
        ticker: tickerUpcased
      })}
      {/* For ${quantity} {tickerUpcased} */}
       {/* = {quantity} tickets */}
    </PaneTitle>

    <DepositInfoList />

    <PaneTitle small>
      {/* could say in Coinbase Wallet or MetaMask or whatever here ... */}

      {tx?.inWallet && t('confirmDepositInYourWallet')}
      {tx?.sent && t('depositConfirming')}
    </PaneTitle>

    {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage />}
  </>
}
