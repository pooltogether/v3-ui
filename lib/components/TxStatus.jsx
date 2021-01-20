import FeatherIcon from 'feather-icons-react'
import React, { useContext, useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { shorten } from 'lib/utils/shorten'
import { useTranslation } from 'i18n/client'

export const TxStatus = props => {
  const { tx, title, subtitle } = props
  const { hideOnInWallet, hideOnSent, hideOnSuccess, hideOnError, hideExtraMessage } = props
  const { inWalletMessage, sentMessage, successMessage, errorMessage } = props
  const [showExtraMessage, setShowExtraMessage] = useState(false)
  const { chainId } = useContext(AuthControllerContext)
  const { t } = useTranslation()

  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = Boolean(tx?.error)

  useEffect(() => {
    let key;
    if (txSent) {
      key = setTimeout(() => setShowExtraMessage(true), 15000)
    }
    return () => {
      key && clearTimeout(key)
    }
  }, [txSent])
  
  if (!tx) return null
  if (hideOnInWallet && txInWallet) return null
  if (hideOnSent && txSent) return null
  if (hideOnSuccess && txCompleted) return null
  if (hideOnError && txError) return null

  return (
    <>
      {title && (
        <h3 className='text-inverse mb-4' >{title}</h3>
      )}
      {subtitle && (
        <h6 className='text-accent-1 mb-4' >{subtitle}</h6>
      )}
      {!txCompleted && !txError && (
        <Loader
          type='Oval'
          height={65}
          width={65}
          color='#bbb2ce'
          className='mx-auto mb-4'
        />
      )}
      {txCompleted && !txError && (
        <FeatherIcon
          icon='check-circle'
          className={
            'mx-auto stroke-1 w-16 h-16 stroke-current text-green mb-4'
          }
        />
      )}
      {txCompleted && txError && (
        <FeatherIcon
          icon='x-circle'
          className={'mx-auto stroke-1 w-16 h-16 stroke-current text-red mb-4'}
        />
      )}

      <div className='text-accent-1 text-sm sm:text-base'>
        {t('transactionStatus')}
      </div>

      {txInWallet && !txError && (
        <div className='text-sm sm:text-base text-inverse'>
          {inWalletMessage ? inWalletMessage : t('pleaseConfirmInYourWallet')}
        </div>
      )}
      {txSent && (
        <div className='text-sm sm:text-base text-inverse'>
          {sentMessage ? sentMessage : t('transactionSentConfirming')}
        </div>
      )}
      {txCompleted && !txError && (
        <div className='text-green text-sm sm:text-base'>
          {successMessage ? successMessage : t('transactionSuccessful')}
        </div>
      )}
      {txError && (
        <div className='text-red text-sm sm:text-base'>
          {errorMessage ? errorMessage : t('transactionFailed')}
        </div>
      )}
      {tx.hash && (
        <div className='text-sm sm:text-base text-accent-1'>
          {t('transactionHash')}
          <EtherscanTxLink
            chainId={chainId}
            hash={tx.hash}
            className='underline text-accent-1'
          >
            {shorten(tx.hash)}
          </EtherscanTxLink>
        </div>
      )}
      {showExtraMessage && (
        <div className='text-sm sm:text-base text-accent-4'>
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
