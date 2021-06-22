import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useOnboard } from '@pooltogether/hooks'
import { shorten } from '@pooltogether/utilities'

import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { useTranslation } from 'react-i18next'

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
      <div className='banner--tx-status flex flex-col justify-center items-center py-4 xs:py-6 lg:py-8 rounded-lg w-full text-center'>
        <div className='flex items-center'>
          <div>
            {txCompleted && !txError && (
              <FeatherIcon
                icon='check-circle'
                className={'mx-auto stroke-1 w-8 h-8 stroke-current'}
              />
            )}

            {txCompleted && txError && (
              <FeatherIcon icon='x-circle' className={'mx-auto stroke-1 w-8 h-8 stroke-current'} />
            )}
          </div>

          <div
            className={classnames(
              'text-lg text-white p-4 xs:p-6 sm:py-7 sm:px-8 lg:p-8 rounded-full w-full',
              {
                'bg-functional-red': txInWallet && !txError,
                'bg-green': txSent,
                'bg-red': txSent
              }
            )}
          >
            {txInWallet &&
              !txError &&
              (inWalletMessage ? inWalletMessage : t('pleaseConfirmInYourWallet'))}

            {txSent && !txCompleted && (sentMessage ? sentMessage : t('transactionSentConfirming'))}

            {txCompleted &&
              !txError &&
              (successMessage ? successMessage : t('transactionSuccessful'))}

            {txError && (errorMessage ? errorMessage : t('transactionFailed'))}
          </div>
        </div>

        {tx.hash && (
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
        )}
      </div>

      {showExtraMessage && (
        <div className='text-xxs sm:text-xs text-accent-4'>
          {t('transactionsMayTakeAFewMinutes')}
        </div>
      )}
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
