import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useCurrentPool, useUsersAddress } from '@pooltogether/hooks'
import { Button } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PrizePool'

import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function WithdrawSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const { quantityBN, quantity, needsApproval, tickerUpcased } = props

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const { data: pool } = useCurrentPool(router)

  const poolAddress = pool.prizePool.address
  const sponsorshipAddress = pool.tokens.sponsorship.address

  const [txId, setTxId] = useState(0)

  const quantityFormatted = numberWithCommas(quantity)

  const txName = t(`withdrawSponsorshipAmountTicker`, {
    amount: quantityFormatted,
    ticker: tickerUpcased
  })
  const method = 'withdrawInstantlyFrom'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const withdrawSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleWithdrawSponsorshipClick = async (e) => {
    e.preventDefault()

    // there should be no exit fee when withdrawing sponsorship
    const maxExitFee = '0'

    const params = [
      usersAddress,
      quantityBN,
      sponsorshipAddress,
      ethers.utils.parseEther(maxExitFee)
    ]

    const id = await sendTx(txName, PrizePoolAbi, poolAddress, method, params)
    setTxId(id)
  }

  return (
    <>
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
  )
}
