import React, { useState } from 'react'
import ControlledTokenAbi from '@pooltogether/pooltogether-contracts_3_3/abis/ControlledToken'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useTransaction } from '@pooltogether/hooks'

import { useSendTransactionWrapper } from 'lib/hooks/useSendTransactionWrapper'
import { useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool } from 'lib/hooks/useUsersTokenBalanceAndAllowance'
import { formatUsersTokenDataForPool } from 'lib/utils/formatUsersTokenDataForPool'

export function RevokePoolAllowanceTxButton (props) {
  const { t } = useTranslation()

  const { pool } = props
  const poolAddress = pool.prizePool.address
  const tokenAddress = pool.tokens.underlyingToken.address
  const ticker = pool.tokens.underlyingToken.symbol
  const tickerUpcased = ticker.toUpperCase()

  const { data: usersChainData, refetch } = useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool()

  const { usersTokenAllowance } = formatUsersTokenDataForPool(pool, usersChainData)

  const [txId, setTxId] = useState(0)

  const txName = t(`revokePoolAllowance`, { ticker: tickerUpcased })
  const method = 'approve'

  const sendTx = useSendTransactionWrapper()
  const tx = useTransaction(txId)

  if (usersTokenAllowance.eq(0)) {
    return null
  }

  const handleRevokeAllowanceClick = async (e) => {
    e.preventDefault()

    const params = [poolAddress, ethers.utils.parseEther('0')]

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

  return (
    <>
      <div className='m-2'>
        <a
          id='_revokePoolAllowance'
          onClick={handleRevokeAllowanceClick}
          disabled={tx?.sent && !tx?.completed}
          className='cursor-pointer'
        >
          {t('revokePoolAllowance', {
            ticker
          })}
        </a>
      </div>
    </>
  )
}
