import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PTHint } from 'lib/components/PTHint'
import { LoadingDots } from 'lib/components/LoadingDots'

export const TransactionsUIListItem = (props) => {
  const { tx } = props

  return <li
    key={tx.hash || Date.now()}
    className='relative mb-2'
  >
    <div className='flex justify-between w-full'>
      <div
        // style={{
        //   minWidth: 300
        // }}
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
        {!tx.completed && <LoadingDots />}

        {tx.completed && !tx.error && <>
          <FeatherIcon
            icon='check-circle'
            className='relative w-6 h-6 text-green'
            style={{
              top: 4,
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
            {/* <>
              <span
                className='relative inline-flex items-center justify-center border-red border-2 rounded-full w-6 h-6'
              >
                <span
                  className='relative text-red font-bold font-number font-bold'
                  style={{
                    left: 1,
                    top: 1
                  }}
                >
                  ?
                </span>
            </span>
            </> */}
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