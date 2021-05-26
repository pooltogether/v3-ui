import React, { useState } from 'react'
import { ethers } from 'ethers'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'react-i18next'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usersDataForPool } from 'lib/utils/usersDataForPool'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool } from 'lib/hooks/useUsersTokenBalanceAndAllowance'

export function RevokePoolAllowanceTxButton(props) {
  const { t } = useTranslation()

  const { pool } = props
  const poolAddress = pool.prizePool.address
  const tokenAddress = pool.tokens.underlyingToken.address
  const ticker = pool.tokens.underlyingToken.symbol
  const tickerUpcased = ticker.toUpperCase()

  const { data: usersChainData, refetch } = useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool()
  const { usersTokenAllowance } = usersDataForPool(pool, usersChainData)

  const [txId, setTxId] = useState(0)

  const txName = t(`revokePoolAllowance`, { ticker: tickerUpcased })
  const method = 'approve'

  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  if (usersTokenAllowance.eq(0)) {
    return null
  }

  const handleRevokeAllowanceClick = async (e) => {
    e.preventDefault()

    const params = [poolAddress, ethers.utils.parseEther('0')]

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params, refetch)

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
