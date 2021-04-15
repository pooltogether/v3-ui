import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useUsersChainData } from 'lib/hooks/useUsersChainData'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usersDataForPool } from 'lib/utils/usersDataForPool'
import { useTransaction } from 'lib/hooks/useTransaction'

export function RevokePoolAllowanceTxButton(props) {
  const { t } = useTranslation()

  const { pool } = props
  const poolAddress = pool.prizePool.address
  const tokenAddress = pool.tokens.underlyingToken.address
  const ticker = pool.tokens.underlyingToken.symbol
  const tickerUpcased = ticker.toUpperCase()

  const { data: usersChainData } = useUsersChainData(poolAddress, tokenAddress)
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

    const params = [
      poolAddress,
      ethers.utils.parseEther('0')
      // {
      //   gasLimit: 200000
      // }
    ]

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params)

    setTxId(id)
  }

  return (
    <>
      <div className='m-2'>
        <Button
          noAnim
          textSize='xxs'
          id='_revokePoolAllowance'
          onClick={handleRevokeAllowanceClick}
          disabled={tx?.sent && !tx?.completed}
        >
          {t('revokePoolAllowance', {
            ticker
          })}
        </Button>
      </div>
    </>
  )
}
