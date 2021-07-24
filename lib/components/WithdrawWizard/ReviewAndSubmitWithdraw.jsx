import React, { useEffect } from 'react'
import { useOnboard } from '@pooltogether/hooks'
import { Button, Tooltip } from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'

import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import IconNetwork from 'assets/images/icon-network@2x.png'
import { Banner } from 'lib/components/Banner'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useTransaction } from 'lib/hooks/useTransaction'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { TxStatus } from 'lib/components/TxStatus'
import { ConnectToNetworkContent } from 'lib/components/DepositWizard/ReviewAndSubmitDeposit'

export const ReviewAndSubmitWithdraw = (props) => {
  const { isUserOnCorrectNetwork } = props

  const { network: walletChainId, address: usersAddress, connectWallet } = useOnboard()

  if (!usersAddress) {
    return <ConnectWallet {...props} connectWallet={connectWallet} />
  } else if (!isUserOnCorrectNetwork) {
    return <ConnectNetwork {...props} walletChainId={walletChainId} />
  } else {
    return <SubmitWithdraw {...props} />
  }
}

const ConnectWallet = (props) => {
  const { connectWallet } = props
  const { t } = useTranslation()
  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <div>
        <Button textSize='xl' onClick={() => connectWallet()}>
          {t('connectWallet')}
        </Button>
      </div>
      <Tooltip
        id='what-is-eth-tooltip'
        title='Ethereum'
        className='mt-4 mx-auto w-48'
        tip={
          <>
            {t('whatIsEthereumOne')} {t('whatIsEthereumTwo')}
          </>
        }
      >
        <span className='opacity-60 font-bold text-caption w-48'>{t('whatsAnEthereum')}</span>
      </Tooltip>
    </>
  )
}

const ConnectNetwork = (props) => {
  const { chainId } = props
  const { t } = useTranslation()

  return (
    <div className='flex flex-col h-full pt-16'>
      <Banner
        gradient={null}
        className='w-full flex items-center justify-center mx-auto text-xs sm:text-lg text-highlight-2 bg-card text-center mb-8'
      >
        <img src={IconNetwork} className='inline-block mr-2 w-8' />
        {t('youreOnTheWrongNetworkSwitchToNetworkName', {
          networkName: getNetworkNiceNameByChainId(chainId)
        })}
      </Banner>
      <div className='flex flex-col h-full justify-center'>
        <ReviewAmountAndTitle {...props} />
        <ConnectToNetworkContent chainId={chainId} />
      </div>
    </div>
  )
}

const SubmitWithdraw = (props) => {
  const {
    chainId,
    cards,
    withdrawTxId,
    setWithdrawTxId,
    tokenSymbol,
    submitWithdrawTransaction,
    nextStep,
    hasExitFee
  } = props
  const { t } = useTranslation()

  const tx = useTransaction(withdrawTxId)

  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  const handleWithdrawClick = async (e) => {
    e.preventDefault()
    const id = await submitWithdrawTransaction()
    setWithdrawTxId(id)
  }

  useEffect(() => {
    if (tx?.completed && !tx?.cancelled && !tx?.error) {
      nextStep()
    }
  }, [tx?.completed])

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      {cards}
      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmWithdrawInYourWallet')}
        sentMessage={t('withdrawConfirming')}
      />
      {!txPending && (
        <ButtonDrawer>
          <ButtonTx
            border='orange'
            text='orange'
            bg='transparent'
            hoverBorder='orange'
            hoverText='orange'
            hoverBg='orange-darkened'
            chainId={chainId}
            textSize='lg'
            onClick={handleWithdrawClick}
            className='mx-auto'
          >
            {hasExitFee
              ? t('withdrawTickerAndPay', { ticker: tokenSymbol })
              : t('withdrawTicker', { ticker: tokenSymbol })}
          </ButtonTx>
        </ButtonDrawer>
      )}
    </>
  )
}

const ReviewAmountAndTitle = (props) => {
  const { tokenAddress, tokenSymbol, label, quantity, isValidAllowance } = props

  const { t } = useTranslation()

  return (
    <>
      <WithdrawAndDepositPaneTitle label={label} symbol={tokenSymbol} address={tokenAddress} />
      <WithdrawAndDepositBanner
        label={t('youreWithdrawing')}
        quantity={quantity}
        tickerUpcased={tokenSymbol}
        disabled={!isValidAllowance}
      />
    </>
  )
}