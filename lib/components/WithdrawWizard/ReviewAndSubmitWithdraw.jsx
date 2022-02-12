import React from 'react'
import { useTransaction } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { Button, Tooltip } from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import IconNetwork from 'images/icon-network@2x.png'
import { Banner } from 'lib/components/Banner'
import { ButtonTx } from 'lib/components/ButtonTx'
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
        <Button textSize='lg' onClick={() => connectWallet()}>
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
        <Image src={IconNetwork} className='inline-block mr-2 w-8' />
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

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <div className='my-8 space-y-4'>{cards}</div>
      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmWithdrawInYourWallet')}
        sentMessage={t('withdrawConfirming')}
      />
      <ButtonDrawer>
        {!txPending && (
          <ButtonTx
            isCentered
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
        )}
      </ButtonDrawer>
    </>
  )
}

const ReviewAmountAndTitle = (props) => {
  const { chainId, tokenAddress, tokenSymbol, label, quantity, isValidAllowance } = props

  const { t } = useTranslation()

  return (
    <>
      <WithdrawAndDepositPaneTitle
        chainId={chainId}
        label={label}
        symbol={tokenSymbol}
        address={tokenAddress}
      />
      <WithdrawAndDepositBanner
        label={t('youreWithdrawing')}
        quantity={quantity}
        tickerUpcased={tokenSymbol}
        disabled={!isValidAllowance}
      />
    </>
  )
}
