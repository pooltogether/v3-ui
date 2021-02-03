import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { usePool } from 'lib/hooks/usePool'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function DepositSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const {
    quantity,
    quantityBN,
    needsApproval,
    tickerUpcased,
  } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)
  
  const { pool } = usePool()

  const poolAddress = pool?.poolAddress

  const controlledSponsorshipTokenAddress = pool?.sponsorshipToken?.id


  const [txId, setTxId] = useState()

  const quantityFormatted = numberWithCommas(quantity, { precision: 2 })

  const txName = t(`depositAmountTickerToSponsorship`, {
    amount: quantityFormatted,
    ticker: tickerUpcased
  })
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const tx = transactions?.find((tx) => tx.id === txId)

  const depositSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)



  const handleDepositSponsorshipClick = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      quantityBN,
      controlledSponsorshipTokenAddress,
      ethers.constants.AddressZero
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


  const depositSponsorshipButtonClassName = needsApproval ? 'w-full' : 'w-48-percent'

  const depositSponsorshipButton = <Button
    noAnim
    textSize='lg'
    onClick={handleDepositSponsorshipClick}
    disabled={!quantity || needsApproval || depositSponsorshipTxInFlight}
    className={depositSponsorshipButtonClassName}
  >
    {t('depositSponsorship')}
  </Button>

  return <>
    {needsApproval ? <>
      <PTHint
        title='Allowance'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            {t('needToProvideEnoughAllowance')}
          </div>
        </>}
        className='w-48-percent'
      >
        {depositSponsorshipButton}
      </PTHint>
    </> : depositSponsorshipButton}
  </>
}
