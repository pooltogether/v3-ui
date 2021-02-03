import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation, Trans } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { usePlayerPoolBalances } from 'lib/hooks/usePlayerPoolBalances'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TxStatus } from 'lib/components/TxStatus'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function ConfirmWithdrawNoFee(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props
  
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const { pool } = usePool()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const {
    usersTicketBalanceBN
  } = usePlayerPoolBalances(address, pool)

  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = pool?.underlyingCollateralSymbol?.toUpperCase()
  const poolAddress = pool?.poolAddress
  const controlledTicketTokenAddress = pool?.ticket?.id

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const quantityFormatted = numberWithCommas(quantity, { precision: 2 })

  const txMainName = `${t('withdraw')}: ${quantityFormatted} ${t('tickets')}`
  const txSubName = `${quantityFormatted} ${tickerUpcased}`
  const txName = `${txMainName} (${txSubName})`
  const method = 'withdrawInstantlyFrom'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)
  
  const tx = transactions?.find((tx) => tx.id === txId)
  
  const runTx = async () => {
    setTxExecuted(true)

    // there should be no exit fee when we do an instant no-fee withdrawal
    const maxExitFee = '0'

    const params = [
      usersAddress,
      ethers.utils.parseUnits(
        quantity.toString(),
        Number(decimals)
      ),
      controlledTicketTokenAddress,
      ethers.utils.parseEther(maxExitFee),
    ]

    const id = await sendTx(
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

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])



  return <>
    {!tx?.sent && <>
      <PaneTitle>
        {t('confirmWithdrawalOfTickets')}
      </PaneTitle>

      <div
        className='confirm-withdraw-no-fee text-center mx-auto rounded-xl text-orange bg-orange-darkened border-2 border-orange py-2 xs:py-8 px-2 xs:px-8'
        style={{
          maxWidth: 600
        }}
      >
        <h4
          className='text-orange'
        >
          <span className='font-normal'>
            {t('amountToBeWithdrawn')} 
          </span> -<PoolNumber>{quantity}</PoolNumber> {tickerUpcased}
        </h4>

        <WithdrawOdds
          pool={pool}
          usersTicketBalanceBN={usersTicketBalanceBN}
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
    </>}

    <TxStatus
      hideOnInWallet
      tx={tx}
      title={t('withdrawing')}
      subtitle={<>{quantityFormatted} {tickerUpcased}</>}
    />
  </>
}
