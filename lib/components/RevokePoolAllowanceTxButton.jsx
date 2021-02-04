import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { useUsersChainData } from 'lib/hooks/useUsersChainData'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usersDataForPool } from 'lib/utils/usersDataForPool'
import { useTransaction } from 'lib/hooks/useTransaction'

export function RevokePoolAllowanceTxButton(props) {
  const { t } = useTranslation()

  const { pool } = usePool()
  const { usersChainData } = useUsersChainData(pool)

  const {
    usersTokenAllowance,
  } = usersDataForPool(pool, usersChainData)
  
  const poolAddress = pool?.poolAddress
  const tokenAddress = pool?.underlyingCollateralToken

  const ticker = pool && pool.underlyingCollateralSymbol
  const tickerUpcased = ticker && ticker.toUpperCase()


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
      ethers.utils.parseEther('0'),
      // {
      //   gasLimit: 200000
      // }
    ]

    const id = await sendTx(
      txName,
      ControlledTokenAbi,
      tokenAddress,
      method,
      params,
    )

    setTxId(id)
  }

  return <>
    <div className='m-2'>
      <Button
        secondary
        id='_revokePoolAllowance'
        onClick={handleRevokeAllowanceClick}
        disabled={tx?.sent && !tx?.completed}
      >
        {t('revokePoolAllowance', {
          ticker: pool?.underlyingCollateralSymbol
        })}
      </Button>
    </div>
  </>
}
