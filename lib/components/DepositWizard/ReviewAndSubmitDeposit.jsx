import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import {
  useAddNetworkToMetamask,
  useIsWalletMetamask,
  useOnboard,
  useTokenAllowance,
  useTokenBalances,
  useSendTransaction,
  useTransaction
} from '@pooltogether/hooks'
import { Amount, Button, Card, Tooltip, poolToast } from '@pooltogether/react-components'
import {
  ETHEREUM_NETWORKS,
  getNetworkNiceNameByChainId,
  numberWithCommas
} from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import { parseUnits } from '@ethersproject/units'

import ERC20Abi from 'abis/ERC20Abi'
import IconNetwork from 'assets/images/icon-network@2x.png'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { Banner } from 'lib/components/Banner'
import { ButtonTx } from 'lib/components/ButtonTx'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { TxStatus } from 'lib/components/TxStatus'

export const ReviewAndSubmitDeposit = (props) => {
  const { chainId, tokenAddress, contractAddress, isUserOnCorrectNetwork, quantity, depositTxId } =
    props

  const { network: walletChainId, address: usersAddress, connectWallet } = useOnboard()

  const {
    data: tokenAllowanceData,
    isFetched,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(chainId, usersAddress, contractAddress, tokenAddress)

  const { data: usersBalance, isFetched: isUsersBalanceFetched } = useTokenBalances(
    chainId,
    usersAddress,
    [tokenAddress]
  )

  const decimals = isUsersBalanceFetched ? usersBalance[tokenAddress].decimals : null
  const usersBalanceUnformatted = usersBalance?.[tokenAddress].amountUnformatted
  const quantityUnformatted = isUsersBalanceFetched ? parseUnits(quantity, decimals) : null

  const isValidAllowance = isFetched ? tokenAllowanceData.isAllowed : true
  const isQuantityValid = isUsersBalanceFetched
    ? usersBalanceUnformatted.gte(quantityUnformatted)
    : false

  const tx = useTransaction(depositTxId)
  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  if (!usersAddress) {
    return <ConnectWallet {...props} connectWallet={connectWallet} />
  } else if (!isFetched || !isUsersBalanceFetched) {
    return <V3LoadingDots className='mx-auto' />
  } else if (!isUserOnCorrectNetwork) {
    return (
      <ConnectNetwork
        {...props}
        walletChainId={walletChainId}
        isValidAllowance={isValidAllowance}
      />
    )
  } else if (!isQuantityValid && !txPending) {
    return <InvalidQuantity {...props} usersBalance={usersBalance?.[tokenAddress].amount} />
  } else if (!tokenAllowanceData?.isAllowed) {
    return (
      <ApproveDeposit
        {...props}
        {...tokenAllowanceData}
        isValidAllowance={isValidAllowance}
        refetchTokenAllowance={refetchTokenAllowance}
      />
    )
  } else {
    return <SubmitDeposit {...props} isValidAllowance={isValidAllowance} />
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
    <>
      <ReviewAmountAndTitle {...props} />
      <Banner
        gradient={null}
        className='w-full flex items-center justify-center mx-auto text-xs sm:text-lg text-highlight-2 bg-card text-center my-8'
      >
        <img src={IconNetwork} className='inline-block mr-2 w-8' />
        {t('youreOnTheWrongNetworkSwitchToNetworkName', {
          networkName: getNetworkNiceNameByChainId(chainId)
        })}
      </Banner>
      <ConnectToNetworkContent chainId={chainId} />
    </>
  )
}

export const ConnectToNetworkContent = (props) => {
  const { chainId } = props
  const isWalletMetamask = useIsWalletMetamask()
  const addNetwork = useAddNetworkToMetamask(chainId)
  const networkName = getNetworkNiceNameByChainId(chainId)
  const { t } = useTranslation()

  const isEthereumNetwork = ETHEREUM_NETWORKS.includes(chainId)

  if (!isWalletMetamask || isEthereumNetwork) {
    return (
      <div className='mt-8 text-xl flex mx-auto'>
        <FeatherIcon icon='alert-triangle' className='w-8 h-8 mr-2' />
        <span>{t('openYourWalletAndSelectNetworkToContinue', { networkName })}</span>
      </div>
    )
  }

  return (
    <ButtonDrawer>
      <Button chainId={chainId} textSize='lg' onClick={addNetwork} className='mx-auto'>
        {t('connectToNetwork', { networkName })}
      </Button>
    </ButtonDrawer>
  )
}

export const InvalidQuantity = (props) => {
  const { previousStep, usersBalance, tokenSymbol } = props

  const { t } = useTranslation()

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <Card className='flex flex-col mx-auto mb-8' backgroundClassName='bg-orange-darkened'>
        <h6>{t('insufficientFunds')}</h6>
        <p className='mt-4 mb-1'>{t('enterAmountLowerThanTokenBalance')}</p>
        <span className='flex flex-row mx-auto'>
          <p className=''>{t('yourBalance')}</p>
          <p className='ml-2'>
            <Amount>{numberWithCommas(usersBalance || 0)}</Amount>
          </p>
          <p className='ml-2'>{tokenSymbol}</p>
        </span>
      </Card>
      <div>
        <Button textSize='lg' onClick={() => previousStep()}>
          {t('back')}
        </Button>
      </div>
    </>
  )
}

const ApproveDeposit = (props) => {
  const { chainId, tokenSymbol, refetchTokenAllowance, tokenAddress, decimals, contractAddress } =
    props
  const { t } = useTranslation()

  const [txId, setTxId] = useState(0)
  const txName = t(`allowTickerPool`, { ticker: tokenSymbol })
  const method = 'approve'
  const sendTx = useSendTransaction(t, poolToast)
  const tx = useTransaction(txId)

  const handleApproveClick = async (e) => {
    e.preventDefault()

    if (!decimals) {
      return
    }

    const params = [contractAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]
    const id = await sendTx({
      name: txName,
      contractAbi: ERC20Abi,
      contractAddress: tokenAddress,
      method,
      params,
      callbacks: { refetch: refetchTokenAllowance }
    })
    setTxId(id)
  }

  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <div className='mb-8 flex flex-col'>
        <span className='text-xs sm:text-sm font-bold mb-2'>
          {t('yourApprovalIsNecessaryBeforeDepositing')}
        </span>
        <Tooltip tip={t('approvalExplainer')} id={`token-approval-tooltip`}>
          <span className='text-xs sm:text-sm text-highlight-1'>{t('whatIsThis')}</span>
        </Tooltip>
      </div>
      <ButtonDrawer>
        {!txPending && (
          <ButtonTx
            isCentered
            tx={tx}
            chainId={chainId}
            textSize='lg'
            onClick={handleApproveClick}
            className='mx-auto'
          >
            {t('allowTicker', {
              ticker: tokenSymbol
            })}
          </ButtonTx>
        )}
      </ButtonDrawer>
      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmApprovalInWallet')}
        sentMessage={t('approvalConfirming')}
      />
    </>
  )
}

const SubmitDeposit = (props) => {
  const { chainId, depositTxId, setDepositTxId, tokenSymbol, submitDepositTransaction, cards } =
    props
  const { t } = useTranslation()

  const tx = useTransaction(depositTxId)

  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  const handleDepositClick = async (e) => {
    e.preventDefault()
    const id = await submitDepositTransaction()
    setDepositTxId(id)
  }

  return (
    <>
      <ReviewAmountAndTitle {...props} />

      {cards}

      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmDepositInYourWallet')}
        sentMessage={t('depositConfirming')}
      />

      <ButtonDrawer>
        {!txPending && (
          <ButtonTx
            isCentered
            border='green'
            text='primary'
            bg='green'
            hoverBorder='green'
            hoverText='primary'
            hoverBg='green'
            chainId={chainId}
            textSize='lg'
            onClick={handleDepositClick}
            className='mx-auto'
          >
            {t('depositTicker', { ticker: tokenSymbol })}
          </ButtonTx>
        )}
      </ButtonDrawer>
    </>
  )
}

const ReviewAmountAndTitle = (props) => {
  const { tokenAddress, tokenSymbol, label, quantity, isValidAllowance, chainId } = props

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
        label={t('yourDeposit')}
        quantity={quantity}
        tickerUpcased={tokenSymbol}
        disabled={!isValidAllowance}
      />
    </>
  )
}
