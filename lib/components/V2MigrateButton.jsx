import React, { useState } from 'react'

import ERC20Abi from 'lib/../abis/ERC20Abi'

import { useTranslation } from 'lib/../i18n'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'

export const V2MigrateButton = (props) => {
  const { balance, balanceFormatted, type, ticker } = props

  const { t } = useTranslation()
  const { contractAddresses } = useContractAddresses()

  const [txId, setTxId] = useState(0)
  const txName = t(`migrateAmountTickerToV3`, {
    amount: balanceFormatted,
    ticker
  })
  const method = 'transfer'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)
  const txInFlight = !tx.completed && !tx.cancelled

  const migrateToV3 = async () => {
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
    const params = [contractAddresses.v2MigrationContractAddress, balance]

    const id = await sendTx(txName, ERC20Abi, erc777ContractAddress, method, params)
    setTxId(id)
  }

  return (
    <>
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
  )
}
