import React from 'react'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { ThemedClipLoader } from 'lib/components/ThemedClipLoader'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'

export function PendingTxButton(props) {
  const { t } = useTranslation()
  const [transactions] = useAtom(transactionsAtom)

  const { openTransactions } = props

  const pendingTransactionsCount = transactions.filter((t) => !t.completed).length
  
  if (pendingTransactionsCount < 1) {
    return null
  }

  return (
    <button
      onClick={openTransactions}
      className='relative flex items-center text-highlight-1 hover:text-inverse font-bold text-xxs sm:text-xs trans tracking-wider outline-none focus:outline-none active:outline-none relative block xs:ml-2 px-2 h-8'
    >
      <div className='inline-block mr-1'>
        <ThemedClipLoader size={10} />
      </div>{' '}
      {t('pendingTransactionsCount', { count: pendingTransactionsCount })}
    </button>
  )
}
