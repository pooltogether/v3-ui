import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { Trans } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { V2MigrateButton } from 'lib/components/V2MigrateButton'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const V2AccountPoolRow = (
  props,
) => {
  const { v2dai } = props
  
  const { usersChainData } = useContext(PoolDataContext)

  const {
    v2DaiPoolCommittedBalance,
    v2DaiPodCommittedBalance,
    v2DaiPodSharesBalance,
    v2UsdcPoolCommittedBalance,
    v2UsdcPodCommittedBalance,
    v2UsdcPodSharesBalance,
  } = usersChainData || {}

  let balances = {}

  const decimals = v2dai ? 18 : 6
  const ticker = v2dai ? 'DAI' : 'USDC'

  const formatBalance = (balBN, decimals) => {
    if (!balBN) {
      return null
    }

    return numberWithCommas(ethers.utils.formatUnits(
      balBN,
      decimals
    ), {
      precision: 8
    })
  }
  
  if (v2dai) {
    balances = {
      poolBalance: v2DaiPoolCommittedBalance,
      poolBalanceFormatted: formatBalance(v2DaiPoolCommittedBalance, 18),
      podBalance: v2DaiPodCommittedBalance,
      podBalanceFormatted: formatBalance(v2DaiPodCommittedBalance, 18),
      podShares: v2DaiPodSharesBalance,
    }
  } else {
    balances = {
      poolBalance: v2UsdcPoolCommittedBalance,
      poolBalanceFormatted: formatBalance(v2UsdcPoolCommittedBalance, 6),
      podBalance: v2UsdcPodCommittedBalance,
      podBalanceFormatted: formatBalance(v2UsdcPodCommittedBalance, 6),
      podShares: v2UsdcPodSharesBalance,
    }
  }

  if (!balances.poolBalance || balances?.poolBalance?.lt('1000000') && balances?.podBalance?.lt('1000000')) {
    return null
  }

  return <>
    <div
      className='ticket-bg'
      style={{
        height: 197,
        width: 410
      }}
      key={`v2-account-pool-row-li-${ticker}`}
    >
      <div className='flex items-center'>
        <PoolCurrencyIcon
          lg
          pool={{ underlyingCollateralSymbol: ticker }}
          className='-mt-2'
        />

        <div
          className='flex w-full ml-1 sm:ml-4 leading-none'
        >
          {balances?.poolBalance?.gte('1000000') && <>
            <div
              className='w-1/2 xs:w-48 inline-block text-left text-xs xs:text-lg text-inverse relative mr-3 xs:mr-6 sm:mr-9 lg:mr-12'
            >
              <Trans
                i18nKey='v2PoolTickets'
                defaults='V2 {{ticker}} Pool Tickets: <bold>{{amount}}</bold>'
                components={{
                  bold: <span className='font-bold' />,
                  light: <span className='text-xs text-default-soft opacity-70' />,
                }}
                values={{
                  amount: numberWithCommas(ethers.utils.formatUnits(
                    balances.poolBalance,
                    decimals,
                  ), {
                    precision: 0
                  }),
                  ticker
                }}
              />
              <div
                className='text-caption font-bold mt-1 opacity-70'
              >
                (<PoolNumber>{balances.poolBalanceFormatted}</PoolNumber> {ticker})
              </div>

              <div className='mt-2'>
                <V2MigrateButton
                  balance={balances.poolBalance}
                  balanceFormatted={balances.poolBalanceFormatted}
                  type={'pool'}
                  ticker={ticker}
                />
              </div>
            </div>
          </>}

          {balances?.podBalance?.gte('1000000') && <>
            <div
              className='w-5/12 inline-block text-left text-xs xs:text-lg text-inverse relative'
            >
              <Trans
                i18nKey='v2PodTickets'
                defaults='V2 {{ticker}} Pod Tickets: <bold>{{amount}}</bold>'
                components={{
                  bold: <span className='font-bold' />,
                  light: <span className='text-xs text-default-soft opacity-70' />,
                }}
                values={{
                  amount: numberWithCommas(ethers.utils.formatUnits(
                    balances.podBalance,
                    decimals,
                  ), {
                    precision: 0
                  }),
                  ticker
                }}
              />
              <div
                className='text-caption font-bold mt-1 opacity-70'
              >
                (<PoolNumber>{numberWithCommas(ethers.utils.formatUnits(
                  balances.podBalance,
                  decimals
                ), {
                  precision: 10
                })}</PoolNumber> {ticker})
              </div>

              <div className='mt-2'>
                <V2MigrateButton
                  balance={balances.podShares}
                  balanceFormatted={balances.podBalanceFormatted}
                  type={'pod'}
                  ticker={ticker}
                />
              </div>
            </div>
          </>}
        
        </div>
      </div>
    </div>
  </>
}
