import React, { useContext } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { useAtom } from 'jotai'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { useTranslation } from 'lib/../i18n'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'

export function PendingTxButton(props) {
  const { t } = useTranslation()
  const [transactions] = useAtom(transactionsAtom)

  const { openTransactions } = props

  const pendingTransactionsCount = transactions.filter((t) => !t.completed).length
  
  const { theme } = useContext(ThemeContext)
  
  const spinnerColor = theme === 'light' ? '#401C94' : 'rgba(255, 255, 255, 0.3)'

  if (pendingTransactionsCount < 1) {
    return null
  }

  return (
    <button
      onClick={openTransactions}
      className='relative flex items-center text-highlight-1 hover:text-inverse font-bold text-xxs sm:text-xs trans tracking-wider outline-none focus:outline-none active:outline-none relative block xs:ml-2 px-2 h-8'
    >
      <div className='inline-block mr-1'>
        <ClipLoader size={10} color={spinnerColor} />
      </div>{' '}
      {t('pendingTransactionsCount', { count: pendingTransactionsCount })}
    </button>
  )
}
