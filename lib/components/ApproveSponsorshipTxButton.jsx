import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function ApproveSponsorshipTxButton(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const {
    decimals,
    disabled,
    needsApproval,
    tickerUpcased,
  } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = usePools()

  const poolAddress = pool?.poolAddress
  const tokenAddress = pool?.underlyingCollateralToken
  
  const [txId, setTxId] = useState()

  const txName = t(`allowTickerPoolSponsorship`, { ticker: tickerUpcased })
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const tx = transactions?.find((tx) => tx.id === txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)


  const handleApproveClick = async (e) => {
    e.preventDefault()

    const params = [
      poolAddress,
      ethers.utils.parseUnits('9999999999', Number(decimals)),
      // {
      //   gasLimit: 200000
      // }
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      ControlledTokenAbi,
      tokenAddress,
      method,
      params,
    )

    setTxId(id)
  }



  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  const approveButton = <Button
    noAnim
    type='button'
    textSize='lg'
    onClick={handleApproveClick}
    disabled={disabled || !needsApproval || unlockTxInFlight}
    className={approveButtonClassName}
  >
    Approve {tickerUpcased}
  </Button>


  return <>
    {!needsApproval ? <>
      <PTHint
        title='Allowance'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            You have provided enough allowance to this pool and don't need to approve anymore.
          </div>
        </>}
        className='w-48-percent'
      >
        {approveButton}
      </PTHint>
    </> : approveButton}
  </>
}
