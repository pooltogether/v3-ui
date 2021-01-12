import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import LootBoxAbi from '@pooltogether/loot-box/abis/LootBox'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function PlunderLootBoxTxButton(props) {
  const { t } = useTranslation()
  
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const { usersAddress, provider } = useContext(AuthControllerContext)

  const {
    disabled,
    prizeNumber,
    pool,
  } = props

  const {
    lootBoxAwards,
    computedLootBoxAddress
  } = pool.lootBox

  const [txId, setTxId] = useState()

  const txName = t(`claimLootBoxNumber`, {
    number: prizeNumber
  })
  const method = 'plunder'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  const tx = transactions?.find((tx) => tx.id === txId)

  const plunderTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handlePlunderClick = async (e) => {
    e.preventDefault()


    // both of these need to be tuples with their tokenId:
    // lootBoxAwards.erc721Addresses
    // lootBoxAwards.erc71155Addresses

    const params = [
      lootBoxAwards.erc20Addresses.map(award => award.address),
      lootBoxAwards.erc721Addresses.map(award => award.address),
      lootBoxAwards.erc1155Addresses.map(award => award.address),
      usersAddress
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      LootBoxAbi,
      computedLootBoxAddress,
      method,
      params
    )
    setTxId(id)
  }


  return (
    <Button
      border='green'
      text='primary'
      bg='green'
      hoverBorder='green'
      hoverText='primary'
      hoverBg='green'
      onClick={handlePlunderClick}
      disabled={disabled || plunderTxInFlight}
      className={'w-full'}
    >
      {t('claim')}
    </Button>
  )
}
