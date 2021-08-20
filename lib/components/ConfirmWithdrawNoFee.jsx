import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useUsersAddress } from '@pooltogether/hooks'
import { Button } from '@pooltogether/react-components'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PrizePool'

import { useTranslation } from 'react-i18next'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { TxStatus } from 'lib/components/TxStatus'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useUserTicketsByPool } from 'lib/hooks/useUserTickets'

export function ConfirmWithdrawNoFee(props) {
  const { t } = useTranslation()

  const router = useRouter()
  const quantity = router.query.quantity
  const prevBalance = router.query.prevBalance

  const { nextStep, previousStep, pool } = props

  const usersAddress = useUsersAddress()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { ticket } = useUserTicketsByPool(pool.prizePool.address, address)
  const amountUnformatted = ticket?.amountUnformatted

  const underlyingToken = pool.tokens.underlyingToken
  const decimals = underlyingToken.decimals
  const tickerUpcased = underlyingToken.symbol
  const poolAddress = pool.prizePool.address
  const controlledTicketTokenAddress = pool.tokens.ticket.address

  const [txExecuted, setTxExecuted] = useState(false)

  const quantityFormatted = numberWithCommas(quantity)

  const [txId, setTxId] = useState(0)
  const txName = `${t('withdraw')}: ${quantityFormatted} ${tickerUpcased}`
  const method = 'withdrawInstantlyFrom'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const runTx = async () => {
    setTxExecuted(true)

    // there should be no exit fee when we do an instant no-fee withdrawal
    const maxExitFee = '0'

    const params = [
      usersAddress,
      ethers.utils.parseUnits(quantity.toString(), Number(decimals)),
      controlledTicketTokenAddress,
      ethers.utils.parseEther(maxExitFee)
    ]

    const id = await sendTx(txName, PrizePoolAbi, poolAddress, method, params)

    setTxId(id)
  }

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return (
    <>
      {!tx?.sent && (
        <>
          <WithdrawAndDepositPaneTitle
            label={t('withdrawTicker', {
              ticker: tickerUpcased
            })}
            symbol={pool.tokens.underlyingToken.symbol}
            address={pool.tokens.underlyingToken.address}
            chainId={pool.chainId}
          />

          <WithdrawAndDepositBanner
            label={t('youreWithdrawing')}
            quantity={quantity}
            tickerUpcased={tickerUpcased}
          />

          <div
            className='w-full text-center mx-auto rounded-lg text-orange bg-orange-darkened border-2 border-orange py-2 xs:py-4 px-4 xs:px-8'
            style={{
              maxWidth: 600
            }}
          >
            <p className='text-base xs:text-xl leading-tight mb-2'>
              {numberWithCommas(prevBalance)} - {numberWithCommas(quantity)} ={' '}
              <div className='font-bold sm:inline'>
                {numberWithCommas(Number(prevBalance) - Number(quantity))} {tickerUpcased}
              </div>
            </p>

            <WithdrawOdds
              pool={pool}
              usersTicketBalanceUnformatted={amountUnformatted}
              withdrawAmount={quantity}
            />
          </div>

          <ButtonDrawer>
            <Button
              onClick={runTx}
              textSize='lg'
              className={'_withdrawBtn _confirmNoFee mx-auto sm:mt-16'}
            >
              {t('confirmWithdrawal')}
            </Button>
          </ButtonDrawer>
        </>
      )}

      <TxStatus
        hideOnInWallet
        tx={tx}
        title={t('withdrawing')}
        subtitle={
          <>
            {quantityFormatted} {tickerUpcased}
          </>
        }
      />
    </>
  )
}
