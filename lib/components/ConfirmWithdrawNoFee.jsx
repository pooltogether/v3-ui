import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation, Trans } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function ConfirmWithdrawNoFee(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)
  console.log(transactions)

  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props
  
  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool, usersTicketBalance } = useContext(PoolDataContext)

  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = pool?.underlyingCollateralSymbol?.toUpperCase()
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.prizeStrategy?.singleRandomWinner?.ticket?.id
  console.log(controlledTokenAddress)

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txMainName = `${t('withdraw')}: ${quantity} ${t('tickets')}`
  const txSubName = `${quantity} ${tickerUpcased}`
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
        quantity,
        Number(decimals)
      ),
      controlledTokenAddress,
      ethers.utils.parseEther(maxExitFee),
      // {
      //   gasLimit: 700000
      // }
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

  // if (!txExecuted && quantity && decimals) {
  //   runTx()
  // }

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
        className='text-center mx-auto rounded-xl text-orange bg-orange-darkened border-2 border-orange py-2 xs:py-8 px-2 xs:px-8'
        style={{
          maxWidth: 600
        }}
      >
        <h4
          className='text-orange'
        >
          <span className='font-normal'>
            {t('amountToBeWithdrawn')} 
          </span> -<Trans
            i18nKey='amountTickets'
            defaults='<number>{{amount}}</number> tickets'
            components={{
              number: <PoolNumber />,
            }}
            values={{
              amount: quantity,
            }}
          />
        </h4>

        <WithdrawOdds
          pool={pool}
          usersBalance={usersTicketBalance}
          quantity={quantity}
        />
      </div>

      <ButtonDrawer>
        <Button
          onClick={runTx}
          textSize='lg'
          // disabled={poolIsLocked}
          className={'mx-auto sm:mt-16'}
        >
          {t('confirmWithdrawal')}
        </Button>
      </ButtonDrawer>
    </>}

    {tx?.sent && !tx?.completed && <>
      <TransactionsTakeTimeMessage
        tx={tx}
        title={t('withdrawing')}
        subtitle={<Trans
          i18nKey='amountTickets'
          defaults='<number>{{amount}}</number> tickets'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
          }}
        />}
      />
    </>}
  </>
}
