import React, { useState } from 'react'
import { ethers } from 'ethers'

import LootBoxControllerAbi from '@pooltogether/loot-box/abis/LootBoxController'

import { useTranslation } from 'react-i18next'
import { Button } from 'lib/components/Button'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'

export function PlunderLootBoxTxButton(props) {
  const { t } = useTranslation()

  const { alreadyClaimed, prizeNumber, lootBox, pool } = props

  const [txId, setTxId] = useState(0)

  const { contractAddresses } = useContractAddresses(pool.chainId)

  const lootBoxControllerAddress = contractAddresses?.lootBoxController
  const lootBoxAddress = contractAddresses?.lootBox

  const txName = t(`claimLootBoxNumber`, {
    number: prizeNumber
  })
  const method = 'plunder'

  const sendTx = useSendTransaction()

  const tx = useTransaction(txId)

  const plunderTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handlePlunderClick = async (e) => {
    e.preventDefault()

    const params = [
      lootBoxAddress,
      lootBox.id,
      lootBox.erc20Tokens.map((token) => token.address),
      lootBox.erc721Tokens.map((award) => ({
        token: award.erc721Entity.id,
        tokenIds: [award.tokenId]
      })),
      lootBox.erc1155Tokens.map((award) => ({
        token: award.erc1155Entity.id,
        ids: [award.tokenId],
        amounts: [ethers.BigNumber.from(award.balance)],
        data: []
      }))
    ]

    const id = await sendTx(txName, LootBoxControllerAbi, lootBoxControllerAddress, method, params)
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
      disabled={alreadyClaimed || plunderTxInFlight}
      className={'w-full'}
    >
      {alreadyClaimed ? t('claimed') : t('claim')}
    </Button>
  )
}
