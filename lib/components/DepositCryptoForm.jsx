import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { DepositExpectationsWarning } from 'lib/components/DepositExpectationsWarning'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { DepositTxButton } from 'lib/components/DepositTxButton'
import { PaneTitle } from 'lib/components/PaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { Tooltip } from 'lib/components/Tooltip'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usersDataForPool } from 'lib/utils/usersDataForPool'
import { TxStatus } from 'lib/components/TxStatus'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool } from 'lib/hooks/useUsersTokenBalanceAndAllowance'

export function DepositCryptoForm(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { data: pool } = useCurrentPool()
  const { data: usersChainData, refetch } = useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool()

  const underlyingToken = pool.tokens.underlyingToken
  const decimals = underlyingToken.decimals
  const tokenAddress = underlyingToken.address
  const ticker = underlyingToken.symbol
  const poolAddress = pool.prizePool.address

  const tickerUpcased = ticker?.toUpperCase()

  const [needsApproval, setNeedsApproval] = useState(true)
  const [cachedUsersBalance, setCachedUsersBalance] = useState()

  const poolIsLocked = pool.prize.isRngRequested

  let quantityBN = ethers.BigNumber.from(0)
  if (decimals) {
    quantityBN = ethers.utils.parseUnits(quantity || '0', Number(decimals))
  }

  const { usersTokenBalanceBN, usersTokenBalance, usersTokenAllowance } = usersDataForPool(
    pool,
    usersChainData
  )

  useEffect(() => {
    setCachedUsersBalance(usersTokenBalance)
  }, [usersTokenBalance])

  useEffect(() => {
    if (quantityBN.gte(0) && usersTokenAllowance.gte(quantityBN)) {
      setNeedsApproval(false)
    } else {
      setNeedsApproval(true)
    }
  }, [quantityBN, usersTokenAllowance])

  let overBalance = false
  if (decimals) {
    overBalance =
      quantity && usersTokenBalanceBN.lt(ethers.utils.parseUnits(quantity, Number(decimals)))
  }
  const quantityIsZero = quantityBN.isZero()

  const txName = t(`allowTickerPool`, { ticker: tickerUpcased })
  const method = 'approve'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleUnlockClick = async (e) => {
    e.preventDefault()

    if (!decimals) {
      return
    }

    const params = [poolAddress, ethers.utils.parseUnits('9999999999', Number(decimals))]

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params, refetch)

    setTxId(id)
  }

  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  const approveButton = (
    <Button
      id='_approveTokenAllowance'
      textSize='lg'
      onClick={handleUnlockClick}
      disabled={!needsApproval || unlockTxInFlight}
      className={approveButtonClassName}
    >
      {!needsApproval && (
        <>
          <FeatherIcon
            strokeWidth='0.25rem'
            icon='check'
            className='inline-block relative w-5 h-5 ml-auto mr-1'
            style={{
              top: '-0.05rem'
            }}
          />
        </>
      )}{' '}
      {t('allowTicker', {
        ticker: tickerUpcased
      })}
    </Button>
  )

  return (
    <>
      <WithdrawAndDepositPaneTitle
        label={t('depositTickerToWin', {
          ticker: tickerUpcased
        })}
        pool={pool}
      />

      <WithdrawAndDepositBanner
        label={t('yourDeposit')}
        quantity={quantity}
        tickerUpcased={tickerUpcased}
      />

      <div className='flex flex-col mx-auto w-full mx-auto items-center justify-center'>
        {overBalance ? (
          <>
            <div className='text-orange my-4 flex flex-col'>
              <h4 className=''>
                {t('youDontHaveEnoughTicker', {
                  ticker: tickerUpcased
                })}
              </h4>
              {/*  TODO: Fix wyre integration
              <div className='mt-2 text-default-soft'>
                <WyreTopUpBalanceDropdown
                  showSuggestion
                  label={
                    <Trans
                      i18nKey='topUpBalance'
                      defaults='<visibleMobile>Buy crypto</visibleMobile><hiddenMobile>Buy more crypto</hiddenMobile>'
                      components={{
                        visibleMobile: <span className='xs:hidden ml-1' />,
                        hiddenMobile: <span className='hidden xs:inline-block ml-1' />,
                      }}
                    />
                  }
                  textColor='text-highlight-2'
                  hoverTextColor='text-highlight-1'
                  className='button-scale mt-4 mb-20 px-10 py-2 text-sm sm:text-xl lg:text-2xl rounded-lg border-highlight-2 border-2 bg-default hover:border-highlight-1 hover:bg-body'
                  tickerUpcased={tickerUpcased}
                  usersAddress={usersAddress}
                />
              </div> */}

              <ButtonDrawer>
                <Button
                  textSize='lg'
                  onClick={previousStep}
                  className='mt-2 inline-flex items-center mx-auto'
                >
                  <FeatherIcon
                    icon='arrow-left'
                    className='relative stroke-current w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
                    style={{
                      top: 1
                    }}
                  />{' '}
                  {t('changeQuantity')}
                </Button>
                <div></div>
              </ButtonDrawer>
            </div>
          </>
        ) : (
          <>
            <div className='text-inverse text-lg w-full'>
              {needsApproval && (
                <>
                  <div
                    className='text-sm px-6 sm:px-10'
                    style={{
                      minHeight: 97
                    }}
                  >
                    {!unlockTxInFlight && (
                      <div>
                        <PaneTitle small>
                          {needsApproval && t('yourApprovalIsNecessary')}

                          {/* could say in Coinbase Wallet or MetaMask or whatever here ... */}
                          {tx?.inWallet && !tx?.cancelled && t('confirmApprovalInWallet')}
                        </PaneTitle>
                        <div className=''>
                          {t('unlockToDepositTicker', {
                            ticker: tickerUpcased
                          })}
                        </div>
                      </div>
                    )}

                    <TxStatus
                      tx={tx}
                      inWalletMessage={t('confirmApprovalInWallet')}
                      sentMessage={t('approvalConfirming')}
                    />
                  </div>
                </>
              )}

              <ButtonDrawer>
                {!needsApproval ? (
                  <>
                    <Tooltip
                      title={t('allowance')}
                      tip={
                        <div className='my-2 text-xs sm:text-sm'>
                          {t('youHaveProvidedEnoughAllowance')}
                        </div>
                      }
                      className='w-48-percent'
                    >
                      {approveButton}
                    </Tooltip>
                  </>
                ) : (
                  approveButton
                )}

                <DepositTxButton
                  needsApproval={needsApproval}
                  quantity={quantity}
                  disabled={poolIsLocked || needsApproval || overBalance || quantityIsZero}
                  poolIsLocked={poolIsLocked}
                  nextStep={nextStep}
                />
              </ButtonDrawer>
            </div>
          </>
        )}

        <DepositExpectationsWarning pool={pool} />
      </div>
    </>
  )
}
