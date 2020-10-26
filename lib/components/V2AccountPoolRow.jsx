import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import ERC20Abi from 'ERC20Abi'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const V2AccountPoolRow = (
  props,
) => {
  const { v2dai } = props
  
  const { t } = useTranslation()
  const { poolAddresses, usersChainData } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const {
    v2DaiPoolCommittedBalance,
    v2DaiPodCommittedBalance,
    v2DaiPodSharesBalance,
    v2UsdcPoolCommittedBalance,
    v2UsdcPodCommittedBalance,
    v2UsdcPodSharesBalance,
  } = usersChainData || {}

  let balances = {}

  if (v2dai) {
    balances = {
      poolBalance: v2DaiPoolCommittedBalance,
      podBalance: v2DaiPodCommittedBalance,
      podShares: v2DaiPodSharesBalance,
    }
  } else {
    balances = {
      poolBalance: v2UsdcPoolCommittedBalance,
      podBalance: v2UsdcPodCommittedBalance,
      podShares: v2UsdcPodSharesBalance,
    }
  }

  const decimals = v2dai ? 18 : 6

  const ticker = v2dai ? 'DAI' : 'USDC'

  const [txId, setTxId] = useState(0)

  const txName = t(`migrateAmountTickerToV3`)
  const method = 'transfer'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  const migrateToV3 = (balance, type) => {
    let erc777ContractAddress

    if (v2dai && type === 'pool') {
      erc777ContractAddress = poolAddresses.v2PoolDAIToken
    } else if (v2dai && type === 'pod') {
      erc777ContractAddress = poolAddresses.v2DAIPod
    } else if (type === 'pool') {
      erc777ContractAddress = poolAddresses.v2PoolUSDCToken
    } else {
      erc777ContractAddress = poolAddresses.v2USDCPod
    }

    // send shares / balanceOf for Pods
    // const balanceNormalized = normalizeTo18Decimals(balance, decimals)
    const params = [
      '0x071911fA06AB97447D644eE4d5BCFdD63C1081a0',
      balance
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      ERC20Abi,
      erc777ContractAddress,
      method,
      params,
    )
    setTxId(id)
  }

  console.log(balances?.podBalance?.toString())
  // console.log(balances?.poolBalance?.lt(1) && balances?.podBalance?.lt(1))
  if (balances?.poolBalance?.lt(1) && balances?.podBalance?.lt(1)) {
    return null
  }

  return <>
    <NonInteractableCard
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
          {balances?.poolBalance?.gte(1) && <>
            <div
              className='w-1/2 xs:w-48 inline-block text-left text-xs xs:text-lg text-inverse relative mr-3 xs:mr-6 sm:mr-9 lg:mr-12'
            >
              <Trans
                i18nKey='v2PoolTickets'
                defaults='V2 {{ticker}} Pool Tickets: <bold>{{amount}}</bold>'
                components={{
                  bold: <span className='font-bold' />,
                  light: <span className='text-xs text-default-soft opacity-50' />,
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
                (<PoolNumber>{numberWithCommas(ethers.utils.formatUnits(
                  balances.poolBalance,
                  decimals
                ), {
                  precision: 8
                })}</PoolNumber> {ticker})
              </div>

              <div className='mt-2'>
                <Button
                  textSize='xxxs'
                  padding='px-4 py-1'
                  className='uppercase'
                  onClick={(e) => {
                    e.preventDefault()
                    migrateToV3(balances.poolBalance, 'pool')
                  }}
                >
                  {t('migrateToV3')}
                </Button>
              </div>
            </div>
          </>}

          {balances?.podBalance?.gte(1) && <>
            <div
              className='w-5/12 inline-block text-left text-xs xs:text-lg text-inverse relative'
            >
              <Trans
                i18nKey='v2PodTickets'
                defaults='V2 {{ticker}} Pod Tickets: <bold>{{amount}}</bold>'
                components={{
                  bold: <span className='font-bold' />,
                  light: <span className='text-xs text-default-soft opacity-50' />,
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
                <Button
                  textSize='xxxs'
                  padding='px-4 py-1'
                  className='uppercase'
                  disabled={txInFlight}
                  onClick={(e) => {
                    e.preventDefault()
                    migrateToV3(balances.podShares, 'pod')
                  }}
                >
                  {t('migrateToV3')}
                </Button>
              </div>
            </div>
          </>}
        
        </div>
      </div>
    </NonInteractableCard>
  </>
}
