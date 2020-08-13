import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PTHint } from 'lib/components/PTHint'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'

export const TransactionsUIListItem = (props) => {
  const { tx } = props

  return <li
    key={tx.hash || Date.now()}
    className='relative pb-2'
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
          <FeatherIcon
            icon='check-circle'
            className='relative w-4 h-4 sm:w-5 sm:h-5 text-green'
            style={{
              top: 2,
            }}
          />
        </>}

        {tx.reason && <>
          <PTHint
            tip={tx.reason}
          >
            <FeatherIcon
              icon='help-circle'
              className='relative w-6 h-6 text-red'
              style={{
                top: 4,
              }}
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