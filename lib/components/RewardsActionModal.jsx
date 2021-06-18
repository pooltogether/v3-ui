import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import Dialog from '@reach/dialog'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import ERC20Abi from 'abis/ERC20Abi'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useOnboard } from '@pooltogether/hooks'

import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { NetworkWarning } from 'lib/components/NetworkWarning'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { Tooltip } from 'lib/components/Tooltip'
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
    prizePoolAddress,
    usersAddress
  } = props

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
  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txSent = tx?.sent && !tx?.completed

  const walletOnWrongNetwork = walletChainId !== chainId

  const onSubmit = async (formData) => {
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
    <Dialog
      aria-label={`${underlyingToken.symbol} Pool ${action} Modal`}
      isOpen={isOpen}
      onDismiss={closeModal}
    >
      <div className='relative text-inverse p-4 bg-modal h-screen sm:h-auto rounded-none sm:rounded-sm sm:max-w-3xl mx-auto flex flex-col'>
        <div className='flex'>
          <button
            className='absolute r-4 t-4 close-button trans text-inverse opacity-40 hover:opacity-100'
            onClick={closeModal}
          >
            <FeatherIcon icon='x-circle' className='w-6 h-6 sm:w-8 sm:h-8' />
          </button>
        </div>

        <div className='flex flex-col justify-center h-5/6 sm:pb-8'>
          <div className='flex flex-col justify-center items-center mb-6 mt-10'>
            {props.tokenImage ?? null}
            <h5>
              {action} {underlyingToken.symbol}
            </h5>
          </div>

          <NetworkWarning walletOnWrongNetwork={walletOnWrongNetwork} chainId={chainId} />

          {/* {txPending && (
            <div className='mx-auto text-center'>
              <TxStatus gradient='basic' tx={tx} />
            </div>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col sm:w-9/12 sm:mx-auto'>
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

            <ButtonDrawer>
              {allowance && (
                <Tooltip
                  isEnabled={approveTooltipEnabled}
                  id={`rewards-modal-approve-${action}-${prizePoolAddress}-tooltip`}
                  tip={approveTooltipTip}
                  className='w-48-percent'
                >
                  <ApproveButton
                    {...props}
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
                    'w-48-percent': allowance,
                    'w-full': confirmTooltipEnabled,
                    'w-2/3 mx-auto': !confirmTooltipEnabled && !allowance
                  })}
                >
                  {txSent && (
                    <span className='mr-2'>
                      {' '}
                      <ThemedClipSpinner size={12} />
                    </span>
                  )}{' '}
                  {allowance ? t('confirmStepTwo') : t('confirmWithdrawal')}
                </Button>
              </Tooltip>
            </ButtonDrawer>
          </form>
        </div>
      </div>
    </Dialog>
  )
}

const ApproveButton = (props) => {
  const { tooltipEnabled, disabled } = props

  const { t } = useTranslation()
  const { decimals, refetch, prizePoolAddress, underlyingToken } = props

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txSent = tx?.sent && !tx?.completed

  const txName = t(`allowTickerPool`, { ticker: underlyingToken.symbol.toUpperCase() })
  const abi = ERC20Abi
  const contractAddress = underlyingToken.address
  const method = 'approve'
  const params = [prizePoolAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]

  const handleApproveClick = async (e) => {
    const id = await sendTx(txName, abi, contractAddress, method, params, refetch)
    setTxId(id)
  }

  return (
    <Button
      inverse
      textSize='sm'
      onClick={handleApproveClick}
      className={classnames('sm:mt-4', {
        'w-48-percent': !tooltipEnabled,
        'w-full': tooltipEnabled
      })}
      disabled={disabled}
    >
      {txSent && (
        <span className='mr-2'>
          {' '}
          <ThemedClipSpinner size={12} />
        </span>
      )}{' '}
      {t('approveStepOne')}
    </Button>
  )
}
