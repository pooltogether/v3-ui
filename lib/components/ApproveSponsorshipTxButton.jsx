import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function ApproveSponsorshipTxButton(props) {
  const { t } = useTranslation()
  const {
    decimals,
    disabled,
    needsApproval,
    tickerUpcased,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const poolAddress = pool?.poolAddress
  const tokenAddress = pool?.underlyingCollateralToken
  
  const [txId, setTxId] = useState()

  const txName = t(`allowTickerPoolSponsorship`, { ticker: tickerUpcased })
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
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

    const id = sendTx(
      t,
      provider,
      usersAddress,
      IERC20Abi,
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
