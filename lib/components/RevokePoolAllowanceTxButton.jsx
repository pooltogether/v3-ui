import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export function RevokePoolAllowanceTxButton(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)
  console.log(transactions)

  const { provider, usersAddress } = useContext(AuthControllerContext)
  const { pool, usersChainData } = useContext(PoolDataContext)

  const {
    usersTokenAllowance,
  } = usersDataForPool(pool, usersChainData)
  
  const poolAddress = pool?.poolAddress
  const tokenAddress = pool?.underlyingCollateralToken

  const ticker = pool && pool.underlyingCollateralSymbol
  const tickerUpcased = ticker && ticker.toUpperCase()


  const [txId, setTxId] = useState()

  const txName = t(`revokePoolAllowance`, { ticker: tickerUpcased })
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const tx = transactions?.find((tx) => tx.id === txId)

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

  return <>
    <div className='m-2'>
      <Button
        secondary
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
