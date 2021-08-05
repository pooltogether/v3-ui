import React, { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import {
  useAddNetworkToMetamask,
  useIsWalletMetamask,
  useOnboard,
  useTokenAllowance
} from '@pooltogether/hooks'
import { Button, Card, Tooltip } from '@pooltogether/react-components'
import { ETHEREUM_NETWORKS, getNetworkNiceNameByChainId } from '@pooltogether/utilities'
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

export const ReviewAndSubmitDeposit = (props) => {
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
      <ApproveDeposit
        {...props}
        {...data}
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
        <ConnectToNetworkContent chainId={chainId} />
      </div>
    </div>
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

const ApproveDeposit = (props) => {
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
        <span className='font-bold'>{t('yourApprovalIsNecessaryBeforeDepositing')}</span>
        <Tooltip tip={t('approvalExplainer')}>
          <span className='text-xxs text-highlight-1'>{t('whatIsThis')}</span>
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

const SubmitDeposit = (props) => {
  const { chainId, depositTxId, setDepositTxId, tokenSymbol, submitDepositTransaction, nextStep } =
    props
  const { t } = useTranslation()

  const tx = useTransaction(depositTxId)

  const txPending = (tx?.inWallet || tx?.sent) && !tx?.cancelled && !tx?.error

  const handleDepositClick = async (e) => {
    e.preventDefault()
    const id = await submitDepositTransaction()
    setDepositTxId(id)
  }

  useEffect(() => {
    if (tx?.completed && !tx?.cancelled && !tx?.error) {
      nextStep()
    }
  }, [tx?.completed])

  return (
    <>
      <ReviewAmountAndTitle {...props} />
      <TxStatus
        tx={tx}
        inWalletMessage={t('confirmDepositInYourWallet')}
        sentMessage={t('depositConfirming')}
      />
      <Card
        className='flex flex-col mx-auto my-8'
        backgroundClassName='bg-functional-red'
        sizeClassName='max-w-md'
      >
        <img className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
        <p>{t('withdrawAnyTimePod')}</p>
        {/* TODO: Link to FAQ/Knowledge base */}
        {/* <ExternalLink>Learn more</ExternalLink> */}
      </Card>

      {!txPending && (
        <ButtonDrawer>
          <ButtonTx
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
        </ButtonDrawer>
      )}
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
