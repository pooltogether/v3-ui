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

  const {
    prizeNumber,
    lootBoxAddress
  } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)

  const poolAddress = lootBoxAddress

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

    // IERC20Upgradeable[] memory erc20,
    //   WithdrawERC721[] memory erc721,
    //     WithdrawERC1155[] memory erc1155,
    //       address payable to

    const params = [
      erc20Awards.map(award),
      erc20Awards.map(award),
      erc20Awards.map(award),
      usersAddress
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      LootBoxAbi,
      poolAddress,
      method,
      params
    )
    setTxId(id)
  }


  return <>
    <Button
      border='green'
      text='primary'
      bg='green'
      hoverBorder='green'
      hoverText='primary'
      hoverBg='green'
      onClick={handlePlunderClick}
      disabled={plunderTxInFlight}
      className={'w-full'}
    >
      {t('claim')}
    </Button>
  </>
}
