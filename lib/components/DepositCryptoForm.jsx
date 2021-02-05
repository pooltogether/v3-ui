import React, { useContext, useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { useUsersChainData } from 'lib/hooks/useUsersChainData'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { DepositTxButton } from 'lib/components/DepositTxButton'
import { DepositFormUsersBalance } from 'lib/components/DepositFormUsersBalance'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PTHint } from 'lib/components/PTHint'
import { WyreTopUpBalanceDropdown } from 'lib/components/WyreTopUpBalanceDropdown'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'
import { TxStatus } from 'lib/components/TxStatus'
import { useTransaction } from 'lib/hooks/useTransaction'
// import { poolTokenSupportsPermitSign } from 'lib/utils/poolTokenSupportsPermitSign'

export function DepositCryptoForm(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { usersAddress, provider } = useContext(AuthControllerContext)

  const { pool } = usePool()
  const { usersChainData } = useUsersChainData(pool)

  const decimals = pool?.underlyingCollateralDecimals
  const tokenAddress = pool?.underlyingCollateralToken
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress

  const tickerUpcased = ticker?.toUpperCase()

  const [needsApproval, setNeedsApproval] = useState(true)
  const [cachedUsersBalance, setCachedUsersBalance] = useState()

  const poolIsLocked = pool?.isRngRequested

  let quantityBN = ethers.utils.bigNumberify(0)
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
    if (
      // poolTokenSupportsPermitSign(chainId, tokenAddress) ||
      quantityBN.gt(0) &&
      usersTokenAllowance.gte(quantityBN)
    ) {
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

    const id = await sendTx(txName, ControlledTokenAbi, tokenAddress, method, params)

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
              top: '-0.05rem',
            }}
          />
        </>
      )}{' '}
      {t('allowTicker', {
        ticker: tickerUpcased,
      })}
    </Button>
  )

  return (
    <>
      <PaneTitle short>
        <div className='inline-block sm:block relative' style={{ top: -2 }}>
          <PoolCurrencyIcon pool={pool} />
        </div>{' '}
        {t('depositTicker', {
          ticker: tickerUpcased,
        })}
      </PaneTitle>

      <div className='mb-6 -mt-2'>
        <PaneTitle small>
          {Number(quantity) === 1 ? (
            <Trans
              i18nKey='oneTicket'
              defaults='<number>1</number> ticket'
              components={{
                number: <PoolNumber />,
              }}
            />
          ) : (
            <Trans
              i18nKey='amountTickets'
              defaults='<number>{{amount}}</number> tickets'
              components={{
                number: <PoolNumber />,
              }}
              values={{
                amount: numberWithCommas(quantity, { precision: 2 }),
              }}
            />
          )}
        </PaneTitle>
      </div>

      <div className='text-sm xs:text-base sm:text-lg lg:text-xl'>
        <DepositFormUsersBalance
          bold={false}
          start={cachedUsersBalance || usersTokenBalance}
          end={numberWithCommas(usersTokenBalance, { precision: 4 })}
          units={tickerUpcased}
        />

        <div className='bg-primary flex text-inverse items-center justify-between w-full mx-auto px-6 py-3 font-bold rounded-bl-lg rounded-br-lg'>
          <div>{t('total')}</div>
          <div>
            <PoolNumber>{numberWithCommas(quantity, { precision: 4 })}</PoolNumber> {tickerUpcased}
          </div>
        </div>
      </div>

      <div className='flex flex-col mx-auto w-full mx-auto items-center justify-center'>
        {overBalance ? (
          <>
            <div className='text-orange my-6 flex flex-col'>
              <h4 className=''>
                {t('youDontHaveEnoughTicker', {
                  ticker: tickerUpcased,
                })}
              </h4>
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
              </div>

              <ButtonDrawer>
                <Button
                  secondary
                  textSize='lg'
                  onClick={previousStep}
                  className='mt-2 inline-flex items-center mx-auto'
                >
                  <FeatherIcon
                    icon='arrow-left'
                    className='relative stroke-current w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
                    style={{
                      top: 1,
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
            <div className='text-inverse mb-4 text-lg w-full'>
              {needsApproval && (
                <>
                  <div
                    className='text-sm mb-6 px-6 sm:px-10'
                    style={{
                      minHeight: 97,
                    }}
                  >
                    {!unlockTxInFlight && (
                      <>
                        <div className='pt-6'>
                          <PaneTitle small>
                            {needsApproval && t('yourApprovalIsNecessary')}

                            {/* could say in Coinbase Wallet or MetaMask or whatever here ... */}
                            {tx?.inWallet && !tx?.cancelled && t('confirmApprovalInWallet')}
                          </PaneTitle>
                        </div>
                      </>
                    )}

                    {!unlockTxInFlight && needsApproval && (
                      <>
                        <span className='font-bold'>
                          {t('unlockToDepositTicker', {
                            ticker: tickerUpcased,
                          })}
                        </span>
                      </>
                    )}

                    <div className='flex flex-col mt-4'>
                      <TxStatus
                        tx={tx}
                        inWalletMessage={t('confirmApprovalInWallet')}
                        sentMessage={t('approvalConfirming')}
                      />
                    </div>
                  </div>
                </>
              )}

              <ButtonDrawer>
                {!needsApproval ? (
                  <>
                    <PTHint
                      title={t('allowance')}
                      tip={
                        <>
                          <div className='my-2 text-xs sm:text-sm'>
                            {t('youHaveProvidedEnoughAllowance')}
                          </div>
                        </>
                      }
                      className='w-48-percent'
                    >
                      {approveButton}
                    </PTHint>
                  </>
                ) : (
                  approveButton
                )}

                <DepositTxButton
                  needsApproval={needsApproval}
                  quantity={quantity}
                  disabled={poolIsLocked || needsApproval || overBalance}
                  poolIsLocked={poolIsLocked}
                  nextStep={nextStep}
                />
              </ButtonDrawer>
            </div>
          </>
        )}
      </div>
    </>
  )
}
