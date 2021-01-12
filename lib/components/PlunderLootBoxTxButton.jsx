import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'

import LootBoxControllerAbi from '@pooltogether/loot-box/abis/LootBoxController'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePools } from 'lib/hooks/usePools'

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
  } = pool.lootBox

  const [txId, setTxId] = useState()

  const { contractAddresses } = usePools()

  const lootBoxControllerAddress = contractAddresses?.lootBoxController



  const txName = t(`claimLootBoxNumber`, {
    number: prizeNumber
  })
  const method = 'plunder'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  const tx = transactions?.find((tx) => tx.id === txId)

  const plunderTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handlePlunderClick = async (e) => {
    e.preventDefault()

    const params = [
      pool.lootBox.computedLootBoxAddress,
      pool.lootBox.tokenId,
      lootBoxAwards.erc20s.map(award => award.erc20Entity.id),
      lootBoxAwards.erc721s.map(award => ({ token: award.erc721Entity.id, tokenIds: [award.tokenId] })),
      lootBoxAwards.erc1155s.map(award => ({
        token: award.erc1155Entity.id,
        ids: [award.tokenId],
        amounts: [ethers.utils.bigNumberify(award.balance)],
        data: []
      }))
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      LootBoxControllerAbi,
      lootBoxControllerAddress,
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
