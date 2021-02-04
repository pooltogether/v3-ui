import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { DepositInfoList } from 'lib/components/DepositInfoList'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePool } from 'lib/hooks/usePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { TxStatus } from 'lib/components/TxStatus'
import { useTransaction } from 'lib/hooks/useTransaction'

const bn = ethers.utils.bigNumberify

export function ExecuteCryptoDeposit(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { chainId, usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = usePool()

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const tokenAddress = pool?.underlyingCollateralToken
  const poolAddress = pool?.poolAddress
  const controlledTicketTokenAddress = pool?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)

  let txMainName = `${t('deposit')} ${numberWithCommas(quantity, { precision: 2 })} ${t('tickets')}`
  const txSubName = `${quantity} ${tickerUpcased}`
  const txName = `${txMainName} (${txSubName})`
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

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

      const params = [
        usersAddress,
        quantityBN,
        controlledTicketTokenAddress,
        referrerAddress,
      ]

      const id = await sendTx(
        txName,
        PrizePoolAbi,
        poolAddress,
        'depositTo',
        params,
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
    <PaneTitle short>
      <div className='inline-block sm:block relative' style={{ top: -2 }}>
        <PoolCurrencyIcon
          pool={pool}
        />
      </div> <Trans
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
          }}
        />
      </PaneTitle>
    </div>

    <div className='mt-4'>
      <DepositInfoList />
    </div>

    <TxStatus
      tx={tx}
      inWalletMessage={t('confirmDepositInYourWallet')}
      sentMessage={t('depositConfirming')}
    />
  </>
}
