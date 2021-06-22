import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useOnboard } from '@pooltogether/hooks'
import { shorten } from '@pooltogether/utilities'

import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { useTranslation } from 'react-i18next'

import WalletIconWhite from 'assets/images/icon-wallet-white.svg'

export const TxStatus = (props) => {
  const { tx } = props
  const { hideOnInWallet, hideOnSent, hideOnSuccess, hideOnError } = props
  const { inWalletMessage, sentMessage, successMessage, errorMessage } = props
  const [showExtraMessage, setShowExtraMessage] = useState(false)
  const { network: chainId } = useOnboard()
  const { t } = useTranslation()

  const txCancelled = tx?.cancelled
  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = Boolean(tx?.error)

  useEffect(() => {
    let key
    if (txSent) {
      key = setTimeout(() => setShowExtraMessage(true), 15000)
    }
    if (txCompleted) {
      setShowExtraMessage(false)
      key && clearTimeout(key)
    }
    return () => {
      key && clearTimeout(key)
    }
  }, [txSent, txCompleted])

  if (!tx) return null
  if (txCancelled) return null
  if (hideOnInWallet && txInWallet) return null
  if (hideOnSent && txSent) return null
  if (hideOnSuccess && txCompleted) return null
  if (hideOnError && txError) return null

  return (
    <>
      <div className='banner--tx-status flex flex-col items-center my-2 rounded-lg w-full text-center'>
        <div 
          className={classnames(
            'flex items-center justify-center w-full p-4 xs:p-6 sm:py-6 sm:px-8 lg:p-8 rounded-full text-lg xs:text-xl',
            {
              'text-white': tx && !txError,
              'text-red': txCompleted && txError,
              'bg-accent-grey-5': txCompleted && !txError,
              'bg-functional-red': (txInWallet && !txError) || (txCompleted && txError),
              'bg-green': txSent
            }
          )}
        >
          <div className='w-8 mr-2 text-right'>
            {txCompleted && !txError && (
              <FeatherIcon
                icon='check-circle'
                className={'ml-auto stroke-1 w-5 h-5 stroke-current'}
              />
            )}

            {(txInWallet && !txError) && (
              <img src={WalletIconWhite} className='ml-auto' />
            )}

            {txCompleted && txError && (
              <FeatherIcon icon='x-circle' className={'ml-auto stroke-1 w-5 h-5 stroke-current'} />
            )}
          </div>

          <div>
            {txInWallet &&
              !txError &&
              (inWalletMessage ? inWalletMessage : t('pleaseConfirmInYourWallet'))}

            {txSent && !txCompleted && (sentMessage ? sentMessage : t('transactionSentConfirming'))}

            {txCompleted &&
              !txError &&
              (successMessage ? successMessage : t('transactionSuccessful'))}

            {txCompleted && txError && (errorMessage ? errorMessage : t('transactionFailed'))}
          </div>
        </div>

        {tx.hash && <>
          <div className='text-xxs sm:text-xs text-accent-1 opacity-60 mt-2'>
            {t('transactionHash')}
            <BlockExplorerLink
              chainId={chainId}
              txHash={tx.hash}
              className='underline text-accent-1'
            >
              {shorten(tx.hash)}
            </BlockExplorerLink>
          </div>

          {showExtraMessage && (
            <div className='text-xxs sm:text-xs text-accent-4 text-center'>
              {t('transactionsMayTakeAFewMinutes')}
            </div>
          )}
        </>}
      </div>

      
    </>
  )
}

TxStatus.defaultProps = {
  hideOnError: false,
  hideOnSuccess: false,
  hideOnInWallet: false,
  hideOnSent: false,
  hideExtraMessage: false
}
