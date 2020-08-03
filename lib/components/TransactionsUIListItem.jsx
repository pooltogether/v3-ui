import React from 'react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PTHint } from 'lib/components/PTHint'
import { LoadingDots } from 'lib/components/LoadingDots'

export const TransactionsUIListItem = (props) => {
  const { tx } = props

  return <li
    key={tx.hash || Date.now()}
    className='relative mb-2'
  >
    <div
      className='absolute '
      style={{ left: -26, top: 5 }}
    >
      {!tx.completed && <LoadingDots />}
    </div>

    <div className='flex'>
      <div
        style={{
          minWidth: 300
        }}
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

      {tx.reason && <>
        <PTHint
          tip={tx.reason}
        >
          <>
            <span
              className='inline-flex items-center justify-center text-white bg-red font-bold capitalize rounded-full ml-4 w-6 h-6'
            >
              ?
          </span>
          </>
        </PTHint>
      </>}
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