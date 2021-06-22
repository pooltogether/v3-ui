import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Button, Tooltip } from '@pooltogether/react-components'
import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'react-i18next'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useCurrentPool } from 'lib/hooks/usePools'

export function ApproveSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const { decimals, disabled, needsApproval, tickerUpcased, refetch } = props

  const { data: pool } = useCurrentPool()

  const poolAddress = pool.prizePool.address
  const tokenAddress = pool.tokens.underlyingToken.address

  const [txId, setTxId] = useState(0)
  const txName = t(`allowTickerPoolSponsorship`, { ticker: tickerUpcased })
  const method = 'approve'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleApproveClick = async (e) => {
    e.preventDefault()

    const params = [poolAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params, refetch)

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
