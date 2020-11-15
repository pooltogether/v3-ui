import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function DepositSponsorshipTxButton(props) {
  const { t } = useTranslation()
  
  const {
    decimals,
    quantity,
    quantityBN,
    needsApproval,
    tickerUpcased,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, refetchSponsorQuery } = poolData

  const poolAddress = pool?.poolAddress
  const sponsorshipAddress = pool?.prizeStrategy?.singleRandomWinner?.sponsorship?.id



  const [txId, setTxId] = useState()

  const txName = t(`depositAmountTickerToSponsorship`, {
    amount: quantity,
    ticker: tickerUpcased
  })
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName, refetchSponsorQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const depositSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)



  const handleDepositSponsorshipClick = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      quantityBN,
      sponsorshipAddress,
      ethers.constants.AddressZero
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
