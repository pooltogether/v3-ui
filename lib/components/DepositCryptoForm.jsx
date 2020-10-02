import React, { useContext, useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { DepositTxButton } from 'lib/components/DepositTxButton'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PTHint } from 'lib/components/PTHint'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { WyreTopUpBalanceDropdown } from 'lib/components/WyreTopUpBalanceDropdown'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export const DepositCryptoForm = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity
  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersChainData } = poolData

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
    quantityBN = ethers.utils.parseUnits(
      quantity || '0',
      Number(decimals)
    )
  }

  const {
    usersTokenBalanceBN,
    usersTokenBalance,
    usersTokenAllowance,
  } = usersDataForPool(pool, usersChainData)

  useEffect(() => {
    setCachedUsersBalance(usersTokenBalance)
  }, [usersTokenBalance])

  useEffect(() => {
    if (
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
    overBalance = quantity && usersTokenBalanceBN.lt(
      ethers.utils.parseUnits(
        quantity,
        Number(decimals)
      )
    )
  }

  const [txId, setTxId] = useState()

  const txName = t(`allowTickerPool`, { ticker: tickerUpcased })
  const method = 'approve'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const unlockTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleUnlockClick = async (e) => {
    e.preventDefault()

    const params = [
      poolAddress,
      ethers.utils.parseUnits('9999999999', Number(decimals)),
      // ethers.utils.parseUnits(
      //   quantity,
      //   Number(decimals)
      // ),
      {
        gasLimit: 200000
      }
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      IERC20Abi,
      tokenAddress,
      method,
      params,
    )
    
    setTxId(id)
  }

  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  const approveButton = <Button
    noAnim
    textSize='lg'
    onClick={handleUnlockClick}
    disabled={!needsApproval || unlockTxInFlight}
    className={approveButtonClassName}
  >
    {!needsApproval && <>
      <FeatherIcon
        strokeWidth='0.25rem'
        icon='check'
        className='inline-block relative w-5 h-5 ml-auto mr-1'
        style={{
          top: '-0.05rem'
        }}
      />
    </>} {t('allowTicker', {
      ticker: tickerUpcased
    })}
  </Button>

  return <>
    <PaneTitle short>
      <div className='inline-block sm:block relative -t-1 -mr-2'>
        <PoolCurrencyIcon
          pool={pool}
        />
      </div> {t('depositTicker', {
        ticker: tickerUpcased
      })}
    </PaneTitle>

    <div className='mb-6 -mt-2'>
      <PaneTitle small>
        <Trans
          i18nKey='amountTickets'
          defaults='<number>{{amount}}</number> tickets'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
          }}
        />
      </PaneTitle>
    </div>

    

    <div
      className='text-sm xs:text-base sm:text-lg lg:text-xl'
    >
      <DepositAndWithdrawFormUsersBalance
        bold={false}
        start={cachedUsersBalance || usersTokenBalance}
        end={numberWithCommas(usersTokenBalance, { precision: 8 })}
        units={tickerUpcased}
      />

      <div
        className='bg-primary flex text-inverse items-center justify-between w-full mx-auto px-6 py-3 font-bold rounded-bl-lg rounded-br-lg'
      >
        <div>
          {t('total')}
        </div>
        <div>
          <PoolNumber>
            {numberWithCommas(quantity, { precision: 8 })}
          </PoolNumber> {tickerUpcased}
        </div>
      </div>
    </div>

    <div
      className='flex flex-col mx-auto w-full mx-auto items-center justify-center'
    >
      
      {overBalance ? <>
        <div className='text-yellow my-6 flex flex-col'>
          <h4
            className=''
          >
            {t('youDontHaveEnoughTicker', {
              ticker: tickerUpcased
            })}
          </h4>
          <div
            className='mt-2 text-default-soft'
          >
            <WyreTopUpBalanceDropdown
              showSuggestion
              label={t('topUpMyBalance')}
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
                  top: 1
                }}
              /> {t('changeQuantity')}
            </Button>
            <div></div>
          </ButtonDrawer>
          
          
        </div>
      </> : <>
        <div
          className='text-inverse mb-4 text-lg w-full'
        >

          {needsApproval && <>
            <div
              className='px-6 sm:px-10 text-sm my-6'
              style={{
                minHeight: 97
              }}
            >
              <PaneTitle small>
                {needsApproval && !unlockTxInFlight && t('yourApprovalIsNecessary')}

                {/* could say in Coinbase Wallet or MetaMask or whatever here ... */}
                {tx?.inWallet && !tx?.cancelled && t('confirmApprovalInWallet')}
                {tx?.sent && !tx?.completed && t('approvalConfirming')}
              </PaneTitle>

              <span className='font-bold'>
                {needsApproval && !unlockTxInFlight && <>
                  {t('unlockToDepositTicker', {
                    ticker: tickerUpcased
                  })}
                </>}
              </span>

              {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage
                tx={tx}
              />}
            </div>
          </>}
          
          <ButtonDrawer>
            {!needsApproval ? <>
              <PTHint
                title={t('allowance')}
                tip={<>
                  <div className='my-2 text-xs sm:text-sm'>
                    {t('youHaveProvidedEnoughAllowance')}
                  </div>
                </>}
                className='w-48-percent'
              >
                {approveButton}
              </PTHint>
            </> : approveButton}

            

            <DepositTxButton
              needsApproval={needsApproval}
              quantity={quantity}
              disabled={needsApproval || overBalance}
              poolIsLocked={poolIsLocked}
              nextStep={nextStep}
            />
          </ButtonDrawer>
        </div>
      </>}
    </div>
  </>
}
