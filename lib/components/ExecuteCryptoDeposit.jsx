import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositInfoList } from 'lib/components/DepositInfoList'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { permitSignOrRegularDeposit } from 'lib/utils/permitSignOrRegularDeposit'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

const bn = ethers.utils.bigNumberify

export const ExecuteCryptoDeposit = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { chainId, usersAddress, provider } = useContext(AuthControllerContext)
  const { usersChainData, pool } = useContext(PoolDataContext)

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const tokenAddress = pool?.underlyingCollateralToken
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket?.id
  const tickerUpcased = ticker?.toUpperCase()

  const {
    usersDaiPermitAllowance,
  } = usersDataForPool(pool, usersChainData)

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  let txMainName = `${t('deposit')} ${numberWithCommas(quantity, { precision: 2 })} ${t('tickets')}`
  // if (poolTokenSupportsPermitSign(chainId, tokenAddress)) {
  //   txMainName = `${t('permitAnd')} ${txMainName}`
  // }

  const txSubName = `${quantity} ${tickerUpcased}`
  const txName = `${txMainName} (${txSubName})`
  
  const [sendTx] = useSendTransaction(txName)

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
        referrerAddress = ethers.constants.AddressZero
        console.log(`referrer address was an invalid Ethereum address:`, e.message)
      }

      const quantityBN = ethers.utils.parseUnits(quantity, Number(decimals))
      const needsPermit = quantityBN.gt(0) && usersDaiPermitAllowance.lt(quantityBN)

      const sharedParams = [
        usersAddress,
        quantityBN,
        controlledTokenAddress,
        referrerAddress,
      ]

      const id = await permitSignOrRegularDeposit(
        t,
        provider,
        chainId,
        usersAddress,
        poolAddress,
        tokenAddress,
        sendTx,
        sharedParams,
        needsPermit
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

      const valueInCentsWithDecimals = Number(quantity) * 100
      const valueInCents = parseInt(valueInCentsWithDecimals, 10)

      // console.log('value in cents', valueInCents)
      // console.log(window.fathom)
      // if (window && window.Fathom) {
        // console.log('send fathom')
        // this is naive as the user would have to stay on
        // the same page until the tx confirms, so it won't be accurate anyways
        // (from app.jsx) Fathom.trackGoal('L4PBHM0U', valueInCents)
      // }
    }
  }, [tx])

  return <>
    <PaneTitle short>
      <Trans
        i18nKey='depositAmountTicker'
        defaults='Deposit <number>{{amount}}</number> {{ticker}}'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          amount: quantity,
          ticker: tickerUpcased,
        }}
      />
    </PaneTitle>

    <div className='-mt-2'>
      <PaneTitle small>
        <Trans
          i18nKey='forAmountTickets'
          defaults='for <number>{{amount}}</number> tickets'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
            ticker: tickerUpcased,
          }}
        />
      </PaneTitle>
    </div>

    <div className='mt-4'>
      <DepositInfoList />
    </div>

    {!tx?.completed && <>
      <TransactionsTakeTimeMessage
        tx={tx}
        paneMessage={<>
          {tx?.inWallet && t('confirmDepositInYourWallet')}
          {tx?.sent && t('depositConfirming')}
        </>}
      />
    </>}
  </>
}
