import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

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
import { poolTokenSupportsPermitSign } from 'lib/utils/poolTokenSupportsPermitSign'
import { permitSignOrRegularDeposit } from 'lib/utils/permitSignOrRegularDeposit'

export const ExecuteCryptoDeposit = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { chainId, usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txMainName = `${t('deposit')} ${numberWithCommas(quantity, { precision: 4 })} ${t('tickets')}`
  const txSubName = `${quantity} ${tickerUpcased}`
  const txName = `${txMainName} (${txSubName})`
  
  const method = 'depositTo'

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

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        referrerAddress,
        // {
        //   gasLimit: 650000
        // }
      ]
      console.log({ sharedParams})

      const id = permitSignOrRegularDeposit(
        t,
        provider,
        chainId,
        usersAddress,
        poolAddress,
        tokenAddress,
        sendTx,
        sharedParams
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
