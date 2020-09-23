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

export const WithdrawSponsorshipTxButton = (props) => {
  const { t } = useTranslation()
  
  const {
    decimals,
    quantity,
    needsApproval,
    tickerUpcased,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, refetchSponsorQuery } = poolData

  const poolAddress = pool?.poolAddress
  const sponsorshipAddress = pool?.sponsorship?.id
  



  const [txId, setTxId] = useState()

  // const txName = `Withdraw Sponsorship (${quantity} ${tickerUpcased})`
  const txName = t(`withdrawSponsorshipAmountTicker`, {
    amount: quantity,
    ticker: tickerUpcased
  })

  // const txName = `Withdraw Sponsorship (${quantity} ${tickerUpcased})`
  const method = 'withdrawInstantlyFrom'

  const [sendTx] = useSendTransaction(txName, refetchSponsorQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const withdrawSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)



  const handleWithdrawSponsorshipClick = async (e) => {
    e.preventDefault()

    const maxExitFee = '1'

    const params = [
      usersAddress,
      ethers.utils.parseUnits(
        quantity,
        Number(decimals)
      ),
      sponsorshipAddress,
      ethers.utils.parseEther(maxExitFee),
      {
        gasLimit: 550000
      }
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


  return <>
    <Button
      noAnim
      textSize='lg'
      onClick={handleWithdrawSponsorshipClick}
      disabled={!quantity || needsApproval || withdrawSponsorshipTxInFlight}
      className={'w-full'}
    >
      Withdraw sponsorship
    </Button>
  </>
}
