import React, { useState } from 'react'
import { ethers } from 'ethers'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { usePoolBySymbol } from 'lib/hooks/usePools'

export function ApproveSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const { decimals, disabled, needsApproval, tickerUpcased } = props

  // TODO: Makes no sense
  const { pool } = usePoolBySymbol('PT-cDAI')

  const poolAddress = pool?.poolAddress
  const tokenAddress = pool?.underlyingCollateralToken

  const [txId, setTxId] = useState(0)
  const txName = t(`allowTickerPoolSponsorship`, { ticker: tickerUpcased })
  const method = 'approve'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleApproveClick = async (e) => {
    e.preventDefault()

    const params = [
      poolAddress,
      ethers.utils.parseUnits('9999999999', Number(decimals))
      // {
      //   gasLimit: 200000
      // }
    ]

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params)

    setTxId(id)
  }

  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  const approveButton = (
    <Button
      noAnim
      type='button'
      textSize='lg'
      onClick={handleApproveClick}
      disabled={disabled || !needsApproval || unlockTxInFlight}
      className={approveButtonClassName}
    >
      Approve {tickerUpcased}
    </Button>
  )

  return (
    <>
      {!needsApproval ? (
        <>
          <PTHint
            title='Allowance'
            tip={
              <>
                <div className='my-2 text-xs sm:text-sm'>
                  You have provided enough allowance to this pool and don't need to approve anymore.
                </div>
              </>
            }
            className='w-48-percent'
          >
            {approveButton}
          </PTHint>
        </>
      ) : (
        approveButton
      )}
    </>
  )
}
