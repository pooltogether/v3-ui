import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import ERC20Abi from 'abis/ERC20Abi'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useOnboard } from '@pooltogether/hooks'
import { Button, Tooltip, Modal } from '@pooltogether/react-components'

import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { DepositExpectationsWarning } from 'lib/components/DepositExpectationsWarning'
import { NetworkWarning } from 'lib/components/NetworkWarning'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { TxStatus } from 'lib/components/TxStatus'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

import WalletIcon from 'assets/images/icon-wallet.svg'

export const RewardsActionModal = (props) => {
  const { t } = useTranslation()

  const {
    isOpen,
    closeModal,
    action,
    maxAmount,
    maxAmountUnformatted,
    method,
    getParams,
    refetch,
    chainId,
    allowance,
    overMaxErrorMsg,
    underlyingToken,
    pool,
    usersAddress,
    isPrize
  } = props

  const prizePoolAddress = pool.prizePool.address

  const { register, handleSubmit, setValue, errors, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const decimals = underlyingToken.decimals
  const tickerUpcased = underlyingToken.symbol?.toUpperCase()

  const { isValid } = formState

  const { network: walletChainId } = useOnboard()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txSent = tx?.sent && !tx?.completed
  const txNotCancelled = tx && !tx?.cancelled
  const txSuccessful = tx?.sent && tx?.completed && !tx?.error
  const txError = tx && tx.error

  const walletOnWrongNetwork = walletChainId !== chainId

  const resetState = () => {
    setTxId(0)
  }

  const onSubmit = async (formData) => {
    if (txSent) {
      return
    }

    const amount = formData[action]
    const txName = `${t(action.toLowerCase())}: ${amount} ${tickerUpcased}`

    const id = await sendTx(
      txName,
      PrizePoolAbi,
      prizePoolAddress,
      method,
      getParams(amount),
      refetch
    )

    setTxId(id)
  }

  const allowanceIsZero = Boolean(allowance && allowance.isZero())

  let approveTooltipTip
  if (walletOnWrongNetwork) {
    approveTooltipTip = t('yourWalletIsOnTheWrongNetwork', {
      networkName: getNetworkNiceNameByChainId(chainId)
    })
  } else if (!allowanceIsZero) {
    approveTooltipTip = t('youHaveProvidedEnoughAllowance', {
      ticker: tickerUpcased
    })
  }

  let confirmTooltipTip
  if (walletOnWrongNetwork) {
    confirmTooltipTip = t('yourWalletIsOnTheWrongNetwork', {
      networkName: getNetworkNiceNameByChainId(chainId)
    })
  } else if (allowanceIsZero) {
    confirmTooltipTip = t('needToApproveTicker', {
      ticker: tickerUpcased
    })
  } else if (!isValid) {
    confirmTooltipTip = t('pleaseEnterAValidAmount', 'Please enter a valid amount')
  }

  const approveTooltipEnabled = walletOnWrongNetwork || !allowanceIsZero
  const approveButtonDisabled = approveTooltipEnabled

  const confirmTooltipEnabled = !isValid || walletOnWrongNetwork || allowanceIsZero
  const confirmButtonDisabled = confirmTooltipEnabled

  return (
    <Modal
      label={`${underlyingToken.symbol} Pool ${action} Modal`}
      isOpen={isOpen}
      closeModal={closeModal}
      noSize
    >
      <div className='relative text-inverse p-4 h-screen sm:h-auto rounded-none sm:rounded-sm sm:max-w-3xl mx-auto flex flex-col'>
        <div className='flex flex-col justify-center h-5/6 sm:pb-8'>
          <div className='flex flex-col justify-center items-center mb-6 mt-10'>
            {props.tokenImage ?? null}
            <h5>
              {action} {underlyingToken.symbol}
              {underlyingToken.pair && `, ${underlyingToken.pair} ${t('pair')}`}
            </h5>
          </div>

          <NetworkWarning walletOnWrongNetwork={walletOnWrongNetwork} chainId={chainId} />

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col sm:w-9/12 sm:mx-auto'>
            {txSent || txSuccessful ? (
              <>
                <div className='mx-auto text-center'>
                  <TxStatus gradient='basic' tx={tx} />
                </div>
              </>
            ) : (
              <>
                <TextInputGroup
                  unsignedNumber
                  autoFocus
                  large
                  id={`text-input-group-${action}`}
                  name={action}
                  register={register}
                  label={t(`amount`)}
                  required={t('amountRequired')}
                  autoComplete='off'
                  validate={{
                    greaterThanBalance: (value) => {
                      let amountUnformatted
                      try {
                        amountUnformatted = ethers.utils.parseUnits(value, decimals)
                      } catch (e) {
                        console.warn(e)
                      }
                      return amountUnformatted?.lte(maxAmountUnformatted) || overMaxErrorMsg
                    },
                    greaterThanZero: (value) => {
                      return (
                        Number(value) > 0 ||
                        t('greaterThanZeroMessage', 'please enter a value higher than 0')
                      )
                    }
                  }}
                  rightLabel={
                    usersAddress &&
                    tickerUpcased && (
                      <button
                        id='_setMaxDepositAmount'
                        type='button'
                        className='font-bold inline-flex items-center'
                        onClick={(e) => {
                          e.preventDefault()
                          setValue(action, maxAmount, { shouldValidate: true })
                        }}
                      >
                        <img src={WalletIcon} className='mr-2' style={{ maxHeight: 12 }} />{' '}
                        {numberWithCommas(maxAmount)} {tickerUpcased}
                      </button>
                    )
                  }
                />

                <span className='h-6 w-full text-xs text-orange text-center'>
                  {errors?.[action]?.message || null}
                </span>
              </>
            )}

            <ButtonDrawer>
              {txSuccessful && !txError ? (
                <>
                  <Button
                    textSize='sm'
                    className='w-full'
                    onClick={(e) => {
                      e.preventDefault()
                      resetState()
                      closeModal()
                    }}
                  >
                    {t('close')}
                  </Button>
                </>
              ) : (
                <>
                  {allowance && (
                    <Tooltip
                      isEnabled={approveTooltipEnabled}
                      id={`rewards-modal-approve-${action}-${prizePoolAddress}-tooltip`}
                      tip={approveTooltipTip}
                      className='w-48-percent'
                    >
                      <ApproveButton
                        {...props}
                        allowanceIsZero={allowanceIsZero}
                        tooltipEnabled={approveTooltipEnabled}
                        disabled={approveButtonDisabled}
                      />
                    </Tooltip>
                  )}

                  <Tooltip
                    isEnabled={confirmTooltipEnabled}
                    id={`rewards-modal-confirm-${action}-${prizePoolAddress}-tooltip`}
                    tip={confirmTooltipTip}
                    className={classnames({
                      'w-48-percent': allowance,
                      'w-2/3 mx-auto': !allowance
                    })}
                  >
                    <Button
                      type='submit'
                      textSize='sm'
                      disabled={confirmButtonDisabled}
                      className={classnames('sm:mt-4', {
                        'w-48-percent': !confirmTooltipEnabled && allowance,
                        'w-full': confirmTooltipEnabled || allowance,
                        'w-2/3 mx-auto': !confirmTooltipEnabled && !allowance
                      })}
                    >
                      {txSent && (
                        <span className='mr-2'>
                          {' '}
                          <ThemedClipSpinner size={14} />
                        </span>
                      )}{' '}
                      {allowance ? t('confirmStepTwo') : t('confirmWithdrawal')}
                    </Button>
                  </Tooltip>
                </>
              )}
            </ButtonDrawer>
          </form>

          {isPrize && !txSent && !txSuccessful && (
            <div className='mt-6 sm:mt-0'>
              <DepositExpectationsWarning pool={pool} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

const ApproveButton = (props) => {
  const { tooltipEnabled, disabled, allowanceIsZero } = props

  const { t } = useTranslation()
  const { decimals, refetch, pool, underlyingToken } = props

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txSent = tx?.sent && !tx?.completed

  const txName = t(`allowTickerPool`, { ticker: underlyingToken.symbol.toUpperCase() })
  const abi = ERC20Abi
  const contractAddress = underlyingToken.address
  const method = 'approve'
  const prizePoolAddress = pool.prizePool.address
  const params = [prizePoolAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]

  const handleApproveClick = async (e) => {
    e.preventDefault()

    if (txSent) {
      return
    }

    const id = await sendTx(txName, abi, contractAddress, method, params, refetch)

    setTxId(id)
  }

  return (
    <Button
      textSize='sm'
      onClick={handleApproveClick}
      className={classnames('sm:mt-4', {
        'flex justify-center items-center': !allowanceIsZero,
        'w-48-percent': !tooltipEnabled,
        'w-full': tooltipEnabled
      })}
      disabled={disabled}
    >
      {!allowanceIsZero && (
        <div className='w-5 mr-2'>
          <FeatherIcon
            icon='check-circle'
            className={'mx-auto stroke-1 w-5 h-5 stroke-current'}
            strokeWidth='5rem'
          />
        </div>
      )}
      {txSent && (
        <span className='mr-2'>
          {' '}
          <ThemedClipSpinner size={14} />
        </span>
      )}{' '}
      {t('approveStepOne')}
    </Button>
  )
}
