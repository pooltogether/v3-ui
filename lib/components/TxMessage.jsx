import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { shorten } from 'lib/utils/shorten'

export const TxMessage = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId } = authControllerContext

  const {
    tx,
    txType,
  } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = (txInWallet || txSent || txCompleted)

  if (!tx) {
    return null
  }

  return <>
    {txInFlight && <>
      <div
        className='pt-10 sm:pt-3 pb-3 px-2 sm:px-4 text-center text-xs sm:text-sm lg:text-base'
      >
        <div
          className='font-bold rounded-lg mb-4 text-default text-xs sm:text-sm uppercase px-2 py-1 bg-purple-900'
        >
          Transaction status
        </div>

        <div
          className='font-bold mb-4 text-inverse text-base sm:text-xl lg:text-2xl'
        >
          {txType}
        </div>

        {txInWallet && <>
          <div
            className='font-bold mb-2 text-green text-base sm:text-lg lg:text-xl'
          >
            Please confirm the transaction in your wallet ...
          </div>
        </>}

        {txSent && <>
          <div
            className='font-bold mb-2 text-green text-base sm:text-lg lg:text-xl'
          >
            Transactions may take a few minutes to complete ...
          </div>

          <div className='my-3'>
            <V3LoadingDots />
          </div>
        </>}

        {txCompleted && !txError && <>
          <div
            className='font-bold mb-2 text-green text-base sm:text-lg lg:text-xl'
          >
            Transaction successful!
          </div>
        </>}

        {txError && <>
          <div
            className='font-bold mb-2 text-red text-base sm:text-lg lg:text-xl'
          >
            There was an error with the transaction
          </div>

          <div className='my-3 text-inverse'>
            {tx && tx.hash ? <>
              {<EtherscanTxLink
                chainId={chainId}
                hash={tx.hash}
              >
                See the result on Etherscan
              </EtherscanTxLink>} or check the JS console.
            </> : <>
              Transaction signature denied
            </>}
          </div>
        </>}

        {tx.hash && <>
          <div
            className='uppercase text-default-soft text-sm sm:text-base'
          >
            Transaction ID: {<EtherscanTxLink
              chainId={chainId}
              hash={tx.hash}
            >
              {shorten(tx.hash)}
            </EtherscanTxLink>}
          </div>

          <div
            className='text-xs sm:text-sm'
          >
            <EtherscanTxLink
              noIcon
              chainId={chainId}
              hash={tx.hash}
            >
              View transaction
            </EtherscanTxLink>
          </div>
        </>}


      </div>
    </>}

  </>

}