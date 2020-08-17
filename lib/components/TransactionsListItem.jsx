import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PTHint } from 'lib/components/PTHint'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'

export const TransactionsListItem = (props) => {
  const { tx } = props

  return <li
    key={tx.hash || Date.now()}
    className='list-item rounded-lg relative p-2 -mx-2'
  >
    <div className='flex justify-between w-full'>
      <div
        className='pr-2'
      >
        {tx.hash ? <>
          <EtherscanTxLink
            chainId={tx.ethersTx.chainId}
            hash={tx.hash}
          >
            {tx.name}
          </EtherscanTxLink>
        </> : tx.name
        }
      </div>

      <div className='w-5'>
        {!tx.completed && <LoadingSpinner />}

        {tx.completed && !tx.error && <>
          <EtherscanTxLink
            noIcon
            chainId={tx.ethersTx.chainId}
            hash={tx.hash}
          >
            <FeatherIcon
              icon='check-circle'
              className='list-item--icon relative w-5 h-5 text-green'
            />
          </EtherscanTxLink>
        </>}

        {tx.reason && <>
          <PTHint
            tip={tx.reason}
          >
            <FeatherIcon
              icon='help-circle'
              className='list-item--icon relative w-5 h-5 text-red'
            />
          </PTHint>
        </>}
      </div>
      

    </div>

    {tx.inWallet && <>
      <span
        className='text-yellow'
      >
        {tx.inWallet && <>
          Please confirm in your wallet...
      </>}
      </span>
    </>}
  </li>
}