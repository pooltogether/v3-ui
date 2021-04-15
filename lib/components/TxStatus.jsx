import FeatherIcon from 'feather-icons-react'
import React, { useContext, useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { shorten } from 'lib/utils/shorten'
import { useTranslation } from 'lib/../i18n'

export const TxStatus = (props) => {
  const { gradient, tx, title, subtitle } = props
  const { hideOnInWallet, hideOnSent, hideOnSuccess, hideOnError } = props
  const { inWalletMessage, sentMessage, successMessage, errorMessage } = props
  const [showExtraMessage, setShowExtraMessage] = useState(false)
  const { chainId } = useContext(AuthControllerContext)
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
    return () => {
      key && clearTimeout(key)
    }
  }, [txSent])

  if (!tx) return null
  if (txCancelled) return null
  if (hideOnInWallet && txInWallet) return null
  if (hideOnSent && txSent) return null
  if (hideOnSuccess && txCompleted) return null
  if (hideOnError && txError) return null

  return (
    <>
      <div className='flex flex-col justify-center'>
        {title && <h3 className='text-accent-1 mb-4'>{title}</h3>}

        {subtitle && <h6 className='text-accent-1 mb-4 -mt-4'>{subtitle}</h6>}

        <Banner gradient={gradient || ''} className='flex flex-col'>
          {txSent && !txCompleted && !txError && (
            <Loader type='Oval' height={40} width={40} color='#bbb2ce' className='mx-auto mb-2' />
          )}

          {txCompleted && !txError && (
            <FeatherIcon
              icon='check-circle'
              className={'mx-auto stroke-1 w-16 h-16 stroke-current text-green mb-4'}
            />
          )}

          {txCompleted && txError && (
            <FeatherIcon
              icon='x-circle'
              className={'mx-auto stroke-1 w-16 h-16 stroke-current text-red mb-4'}
            />
          )}

          {txInWallet && !txError && (
            <div className='text-xs sm:text-sm text-orange font-bold'>
              {inWalletMessage ? inWalletMessage : t('pleaseConfirmInYourWallet')}
            </div>
          )}

          {txSent && (
            <div className='text-xs sm:text-sm text-green font-bold'>
              {sentMessage ? sentMessage : t('transactionSentConfirming')}
            </div>
          )}

          {txCompleted && !txError && (
            <div className='text-xs sm:text-sm text-green font-bold'>
              {successMessage ? successMessage : t('transactionSuccessful')}
            </div>
          )}

          {txError && (
            <div className='text-xs sm:text-sm text-red font-bold'>
              {errorMessage ? errorMessage : t('transactionFailed')}
            </div>
          )}

          {tx.hash && (
            <div className='text-xxs sm:text-xs text-accent-1 opacity-60'>
              {t('transactionHash')}
              <EtherscanTxLink chainId={chainId} hash={tx.hash} className='underline text-accent-1'>
                {shorten(tx.hash)}
              </EtherscanTxLink>
            </div>
          )}

          {showExtraMessage && (
            <div className='text-xxs sm:text-xs text-accent-4'>
              {t('transactionsMayTakeAFewMinutes')}
            </div>
          )}
        </Banner>
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
