import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import ERC20Abi from 'lib/../abis/ERC20Abi'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const V2MigrateButton = (
  props,
) => {
  const { balance, balanceFormatted, type, ticker } = props
  
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const { t } = useTranslation()
  const { contractAddresses } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const [txId, setTxId] = useState(0)

  const txName = t(`migrateAmountTickerToV3`, { 
    amount: balanceFormatted,
    ticker
  })
  const method = 'transfer'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const txInFlight = transactions?.find((tx) => (tx.id === txId) && !tx.completed && !tx.cancelled)

  const migrateToV3 = () => {
    let erc777ContractAddress

    const dai = ticker === 'DAI'

    if (dai && type === 'pool') {
      erc777ContractAddress = contractAddresses.v2PoolDAIToken
    } else if (dai && type === 'pod') {
      erc777ContractAddress = contractAddresses.v2DAIPod
    } else if (type === 'pool') {
      erc777ContractAddress = contractAddresses.v2PoolUSDCToken
    } else {
      erc777ContractAddress = contractAddresses.v2USDCPod
    }

    // send shares / balanceOf for Pods
    // const balanceNormalized = normalizeTo18Decimals(balance, decimals)
    const params = [
      contractAddresses.v2MigrationContractAddress,
      balance
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      ERC20Abi,
      erc777ContractAddress,
      method,
      params,
    )
    setTxId(id)
  }


  return <>
    <Button
      bg='green'
      text='primary'
      border='green'
      textSize='xxxs'
      padding='px-4 py-1'
      className='uppercase'
      disabled={txInFlight}
      onClick={migrateToV3}
    >
      {t('migrateToV3')}
    </Button>
  </>
}
