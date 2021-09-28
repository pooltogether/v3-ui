import React, { useState } from 'react'
import ControlledTokenAbi from '@pooltogether/pooltogether-contracts_3_3/abis/ControlledToken'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { Button, poolToast, Tooltip } from '@pooltogether/react-components'
import { useCurrentPool } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'
import { useTransaction } from '@pooltogether/hooks'
import { useSendTransactionWrapper } from 'lib/hooks/useSendTransactionWrapper'

export function ApproveSponsorshipTxButton (props) {
  const { t } = useTranslation()

  const { decimals, disabled, needsApproval, tickerUpcased, refetch } = props

  const router = useRouter()
  const { data: pool } = useCurrentPool(router)

  const poolAddress = pool.prizePool.address
  const tokenAddress = pool.tokens.underlyingToken.address

  const [txId, setTxId] = useState(0)
  const txName = t(`allowTickerPoolSponsorship`, { ticker: tickerUpcased })
  const method = 'approve'
  const sendTx = useSendTransactionWrapper()
  const tx = useTransaction(txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleApproveClick = async (e) => {
    e.preventDefault()

    const params = [poolAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]

    const id = await sendTx({
      name: txName,
      contractAbi: ControlledTokenAbi,
      contractAddress: tokenAddress,
      method,
      params,
      callbacks: { refetch }
    })

    setTxId(id)
  }

  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  return (
    <Tooltip
      isEnabled={!needsApproval}
      id={`approve-sponsorship-tx-button-tooltip`}
      title='Allowance'
      tip={t('youHaveProvidedEnoughAllowance', { ticker: tickerUpcased })}
      className='w-48-percent'
    >
      <Button
        noAnim
        type='button'
        textSize='lg'
        onClick={handleApproveClick}
        disabled={disabled || !needsApproval || unlockTxInFlight}
        className={approveButtonClassName}
      >
        {t('allowTicker', {
          ticker: tickerUpcased
        })}
      </Button>
    </Tooltip>
  )
}
