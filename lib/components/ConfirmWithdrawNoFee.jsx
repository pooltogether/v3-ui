import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TxStatus } from 'lib/components/TxStatus'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useUserTicketsByPool } from 'lib/hooks/useUserTickets'

// TODO: Enforce wallet chainID here, in case they've already passed the switch network msg
// but are now on the wrong network
export function ConfirmWithdrawNoFee(props) {
  const { t } = useTranslation()

  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep, pool } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)

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
            pool={pool}
          />

          <div className='mt-8 mb-4'>
            <WithdrawAndDepositBanner
              label={t('youreWithdrawing')}
              quantity={quantity}
              tickerUpcased={tickerUpcased}
            />
          </div>

          <div
            className='text-center mx-auto rounded-lg text-orange bg-orange-darkened border-2 border-orange py-2 xs:py-4 px-2 xs:px-8'
            style={{
              maxWidth: 600
            }}
          >
            <h6 className='text-orange'>
              -<PoolNumber>{quantity}</PoolNumber> {tickerUpcased}
            </h6>

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
              // disabled={poolIsLocked}
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
