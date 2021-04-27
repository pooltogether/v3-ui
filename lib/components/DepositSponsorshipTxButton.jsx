import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function DepositSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const { quantity, quantityBN, needsApproval, tickerUpcased, refetch } = props

  const { usersAddress } = useContext(AuthControllerContext)

  const { data: pool } = useCurrentPool()

  const poolAddress = pool.prizePool.address

  const controlledSponsorshipTokenAddress = pool.tokens.sponsorship.address
  const quantityFormatted = numberWithCommas(quantity)

  const txName = t(`depositAmountTickerToSponsorship`, {
    amount: quantityFormatted,
    ticker: tickerUpcased
  })
  const method = 'depositTo'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const depositSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleDepositSponsorshipClick = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      quantityBN,
      controlledSponsorshipTokenAddress,
      ethers.constants.AddressZero
    ]

    const id = await sendTx(txName, PrizePoolAbi, poolAddress, method, params)
    setTxId(id)
  }

  const depositSponsorshipButtonClassName = needsApproval ? 'w-full' : 'w-48-percent'

  const depositSponsorshipButton = (
    <Button
      noAnim
      textSize='lg'
      onClick={handleDepositSponsorshipClick}
      disabled={!quantity || needsApproval || depositSponsorshipTxInFlight}
      className={depositSponsorshipButtonClassName}
    >
      {t('depositSponsorship')}
    </Button>
  )

  return (
    <>
      {needsApproval ? (
        <>
          <PTHint
            title='Allowance'
            tip={
              <>
                <div className='my-2 text-xs sm:text-sm'>{t('needToProvideEnoughAllowance')}</div>
              </>
            }
            className='w-48-percent'
          >
            {depositSponsorshipButton}
          </PTHint>
        </>
      ) : (
        depositSponsorshipButton
      )}
    </>
  )
}
