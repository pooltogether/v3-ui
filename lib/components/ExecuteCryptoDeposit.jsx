import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useUsersAddress } from '@pooltogether/hooks'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { Banner } from 'lib/components/Banner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useCurrentPool } from 'lib/hooks/usePools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { TxStatus } from 'lib/components/TxStatus'
import { useTransaction } from 'lib/hooks/useTransaction'

import IconStar from 'assets/images/icon-star@2x.png'

export function ExecuteCryptoDeposit(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const usersAddress = useUsersAddress()
  const { data: pool } = useCurrentPool()

  const underlyingToken = pool.tokens.underlyingToken
  const decimals = underlyingToken.decimals
  const ticker = underlyingToken.symbol
  const poolAddress = pool.prizePool.address
  const controlledTicketTokenAddress = pool.tokens.ticket.address

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)

  const quantityFormatted = numberWithCommas(quantity)

  const txName = `${t('deposit')} ${quantityFormatted} ${tickerUpcased}`
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

      const params = [usersAddress, quantityBN, controlledTicketTokenAddress, referrerAddress]

      const id = await sendTx(txName, PrizePoolAbi, poolAddress, 'depositTo', params)
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

  return (
    <>
      <WithdrawAndDepositPaneTitle
        label={t('depositTickerToWin', {
          ticker: tickerUpcased
        })}
        pool={pool}
      />

      <WithdrawAndDepositBanner
        label={t('depositing')}
        quantity={quantity}
        tickerUpcased={tickerUpcased}
      />

      <div style={{ minHeight: 103 }}>
        <TxStatus
          tx={tx}
          inWalletMessage={t('confirmDepositInYourWallet')}
          sentMessage={t('depositConfirming')}
        />
      </div>

      <Banner
        gradient={null}
        className='bg-primary mt-2 mx-auto w-full text-accent-1 text-xxs'
        style={{ maxWidth: 380 }}
      >
        <img className='mx-auto mb-3 h-16' src={IconStar} />

        <p>
          {t('ticketsAreInstantAndPerpetual')}
          <br />
          {t('winningsAutomaticallyAdded')}
        </p>
      </Banner>
    </>
  )
}
