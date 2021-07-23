import React, { useEffect, useState } from 'react'
import { useOnboard, useTokenAllowance, useUsersAddress } from '@pooltogether/hooks'
import FeatherIcon from 'feather-icons-react'
import { Button, Card, ExternalLink, Tooltip } from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import IconNetwork from 'assets/images/icon-network@2x.png'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { Banner } from 'lib/components/Banner'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import ERC20Abi from 'abis/ERC20Abi'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { TxStatus } from 'lib/components/TxStatus'
import Bell from 'assets/images/bell-red@2x.png'

export const ReviewAndSubmitWithdraw = (props) => {
  const { chainId, tokenAddress, contractAddress, isUserOnCorrectNetwork } = props

  const { network: walletChainId, address: usersAddress, connectWallet } = useOnboard()

  const {
    data,
    isFetched,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(chainId, usersAddress, contractAddress, tokenAddress)

  const isValidAllowance = isFetched ? data.isAllowed : true

  if (!usersAddress) {
    return <ConnectWallet {...props} connectWallet={connectWallet} />
  } else if (!isFetched) {
    return <V3LoadingDots className='mx-auto' />
  } else if (!isUserOnCorrectNetwork) {
    return (
      <ConnectNetwork
        {...props}
        walletChainId={walletChainId}
        isValidAllowance={isValidAllowance}
      />
    )
  } else if (!data?.isAllowed) {
    return (
      <ApproveWithdraw
        {...props}
        {...data}
        isValidAllowance={isValidAllowance}
        refetchTokenAllowance={refetchTokenAllowance}
      />
    )
  } else {
    return <SubmitWithdraw {...props} isValidAllowance={isValidAllowance} />
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

// TODO: Show button to change network
const ConnectNetwork = (props) => {
  const { chainId, walletChainId } = props
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
      </div>
    </div>
  )
}

const ApproveWithdraw = (props) => {
  const {
    chainId,
    tokenSymbol,
    refetchTokenAllowance,
    tokenAddress,
    decimals,
    contractAddress,
    approveTxId,
    setApproveTxId
  } = props
  const { t } = useTranslation()

  const txName = t(`allowTickerPool`, { ticker: tokenSymbol })
  const method = 'approve'
  const sendTx = useSendTransaction()
  const tx = useTransaction(approveTxId)

  console.log(tx)

  const handleApproveClick = async (e) => {
    e.preventDefault()

    if (!decimals) {
      return
    }

    const params = [contractAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]
    const id = await sendTx(txName, ERC20Abi, tokenAddress, method, params, refetchTokenAllowance)
    setApproveTxId(id)
  }

  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <div className='mb-8 flex flex-col'>
        <span className='font-bold'>Your approval is necessary before withdrawing.</span>
        <Tooltip tip='Before you can withdraw funds into a prize pool, you must give it access to the token you want to withdraw. This is only required the first time you deposit into a new pool.'>
          <span className='text-xxs text-highlight-1'>What is this?</span>
        </Tooltip>
      </div>
      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmApprovalInWallet')}
        sentMessage={t('approvalConfirming')}
      />
      {!txPending && (
        <ButtonDrawer>
          <ButtonTx
            chainId={chainId}
            textSize='xl'
            onClick={handleApproveClick}
            className='mx-auto'
          >
            {t('allowTicker', {
              ticker: tokenSymbol
            })}
          </ButtonTx>
        </ButtonDrawer>
      )}
    </>
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
            {hasExitFee ? `Withdraw ${tokenSymbol} & pay fee` : `Withdraw ${tokenSymbol}`}
          </ButtonTx>
        </ButtonDrawer>
      )}
    </>
  )
}

const ReviewAmountAndTitle = (props) => {
  const { chainId, tokenAddress, tokenSymbol, label, quantity, isValidAllowance } = props

  useEffect(() => {
    console.log(tokenAddress, tokenSymbol, quantity)
  }, [tokenAddress, tokenSymbol, label, quantity])

  return (
    <>
      <WithdrawAndDepositPaneTitle label={label} symbol={tokenSymbol} address={tokenAddress} />
      <WithdrawAndDepositBanner
        label={`You're withdrawing:`}
        quantity={quantity}
        tickerUpcased={tokenSymbol}
        disabled={!isValidAllowance}
      />
    </>
  )
}
