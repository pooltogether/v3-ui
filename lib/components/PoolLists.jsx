import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { NetworkIcon } from '@pooltogether/react-components'
import { useGovernancePools } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'

import { PoolRow } from 'lib/components/PoolRow'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { PoolsListRowLoader, PoolsListUILoader } from 'lib/components/loaders/PoolsListUILoader'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { ALL_NETWORKS_ID, getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { useOnEnvChange } from 'lib/hooks/useOnEnvChange'
import { V4PoolCard } from 'lib/components/V4PoolCard'

// Hide or reorder these pools on listing/index so they're still usable (if you have the URL or on the Account page)
// but don't show up on the listing
const BADGER_PRIZE_POOL_ADDRESS = '0xc2a7dfb76e93d12a1bb1fa151b9900158090395d'
const SOHM_PRIZE_POOL_ADDRESS = '0xeab695a8f5a44f583003a8bc97d677880d528248'

/**
 * Displays a list of Pools.
 * Filters based on query parameter `filter=[networkName]` OR a the path `/pools/[networkName]`
 * If the app is in the wrong mode for the filter
 * (ex. filter mainnet pools by rinkeby) or the filter is invalid, it is ignored.
 * @returns
 */
export const PoolLists = () => {
  const router = useRouter()
  const poolFilters = usePoolFilters()
  const envChainIds = useEnvChainIds()
  const [chainIdFilter, setChainIdFilter] = useState(ALL_NETWORKS_ID)

  // TODO: Clean & generalize. This is ugly.
  // Need to have a fallback for the render switching from
  // mainnet -> testnet and poolFilters have updated
  // but useOnEnvChange hasn't triggered yet
  const formatValue = (key) => poolFilters[key]?.view || null
  useOnEnvChange(() => {
    setChainFilter(ALL_NETWORKS_ID)
  })

  const pathFilter = router?.query?.networkName
  const queryFilter = router?.query?.filter

  const setChainFilter = (chainIdFilter) => {
    if (chainIdFilter !== ALL_NETWORKS_ID) {
      queryParamUpdater.add(router, { filter: chainIdToNetworkName(Number(chainIdFilter)) })
    }
  }

  useEffect(() => {
    // Only for undefined. !queryFilter catches the ALL state and then path filter overrides it.
    if (queryFilter === undefined) {
      const filterChainId = networkNameToChainId(pathFilter)
      // Only set path filter IF we are in the right environment
      if (pathFilter && filterChainId && envChainIds.includes(filterChainId)) {
        setChainIdFilter(Number(filterChainId) || ALL_NETWORKS_ID)
      } else {
        setChainIdFilter(ALL_NETWORKS_ID)
      }
    } else {
      // Check if filter matches app env
      const filterChainId = networkNameToChainId(queryFilter)
      if (filterChainId && envChainIds.includes(filterChainId)) {
        setChainIdFilter(Number(filterChainId))
      } else {
        setChainIdFilter(ALL_NETWORKS_ID)
      }
    }
  }, [queryFilter, pathFilter, envChainIds])

  return (
    <div className='mt-10'>
      <div
        className={classnames(
          'flex flex-col sm:flex-row items-center text-xs sm:text-lg lg:text-xl',
          {
            'justify-between': chainIdFilter !== ALL_NETWORKS_ID,
            'justify-end': chainIdFilter === ALL_NETWORKS_ID
          }
        )}
      >
        {chainIdFilter !== ALL_NETWORKS_ID && (
          <Breadcrumbs networkNiceName={getNetworkNiceNameByChainId(chainIdFilter)} />
        )}
        <SmallDropdownInputGroup
          id='pool-filter'
          formatValue={formatValue}
          onValueSet={setChainFilter}
          currentValue={chainIdFilter}
          values={poolFilters}
          className='filters-width-hover'
        />
      </div>
      <GovernancePoolsList chainIdFilter={chainIdFilter} />
    </div>
  )
}

const Breadcrumbs = (props) => {
  const { networkNiceName } = props
  const { t } = useTranslation()

  return (
    <div className='hidden sm:inline-block text-accent-2 font-inter uppercase font-normal opacity-80 hover:opacity-100 trans -mt-2'>
      <span className='text-xxxs sm:text-xxs'>
        <Link href='/pools' as='/pools'>
          <a className='text-xxxs sm:text-xxs border-b border-secondary hover:text-accent-3'>
            {t('pools')}
          </a>
        </Link>
        <>
          {' '}
          <span className='text-accent-4 opacity-70 mx-1 font-bold'>&gt;</span>{' '}
        </>
        <>{networkNiceName}</>
      </span>
    </div>
  )
}

const GovernancePoolsList = (props) => {
  const { data: pools, isFetched } = useGovernancePools()
  return <PoolList pools={pools} isFetched={isFetched} chainIdFilter={props.chainIdFilter} />
}

const SmallDropdownInputGroup = (props) => {
  return (
    <DropdownInputGroup
      {...props}
      backgroundClasses='bg-card'
      textClasses='text-accent-2 text-xs xs:text-sm trans'
      roundedClasses='rounded-lg'
      paddingClasses='py-2 px-4'
      containerClassName='w-full sm:w-96'
      iconSizeClasses='w-6 h-6'
    />
  )
}

const PoolList = (props) => {
  const { t } = useTranslation()

  const { pools, isFetched, chainIdFilter } = props

  // const reorderSohmPool = (filteredPools) => {
  //   const sohmPool = pools?.find((pool) => pool.prizePool?.address === SOHM_PRIZE_POOL_ADDRESS)
  //   const sohmIndex = filteredPools?.indexOf(sohmPool)

  //   const indexToMoveTo = 3
  //   if (sohmIndex !== -1) {
  //     filteredPools.splice(indexToMoveTo, 0, filteredPools.splice(sohmIndex, 1)[0])
  //   }

  //   return filteredPools
  // }

  const poolsToRender = useMemo(() => {
    let filteredPools =
      pools
        ?.sort((a, b) => b.prize.weeklyTotalValueUsdScaled.sub(a.prize.weeklyTotalValueUsdScaled))
        .filter((pool) => filterByChainId(pool, chainIdFilter))
        .filter(
          (pool) =>
            ![BADGER_PRIZE_POOL_ADDRESS, SOHM_PRIZE_POOL_ADDRESS].includes(pool.prizePool?.address)
        ) || []

    // reorderSohmPool(filteredPools)

    return filteredPools
  }, [pools, chainIdFilter])

  if (!isFetched && poolsToRender.length === 0) return <PoolsListUILoader />

  return (
    <div>
      <ul>
        <V4PoolCard filter={chainIdFilter} />
        {poolsToRender.map((pool) => (
          <PoolRow key={`pool-row-${pool.prizePool.address}`} pool={pool} />
        ))}
        {poolsToRender.length === 0 && (
          <div className='flex flex-col'>
            <span className='mt-10 mx-auto text-accent-1'>
              {t('noBlankPoolsYet', { networkName: getNetworkNiceNameByChainId(chainIdFilter) })}
            </span>
          </div>
        )}
      </ul>
      {!isFetched && <PoolsListRowLoader />}
    </div>
  )
}

const filterByChainId = (pool, chainIdFilter) => {
  if (chainIdFilter === ALL_NETWORKS_ID) return true
  return pool.chainId === chainIdFilter
}

const usePoolFilters = () => {
  const chainIds = useEnvChainIds()
  const { t } = useTranslation()
  return chainIds.reduce(
    (allFilters, chainId) => {
      allFilters[chainId] = {
        value: chainId,
        view: (
          <>
            <NetworkIcon sizeClassName='my-auto h-6 w-6' chainId={chainId} />
            <span className='capitalize ml-2'>{getNetworkNiceNameByChainId(chainId)}</span>
          </>
        )
      }
      return allFilters
    },
    {
      [-1]: {
        view: (
          <div className='flex'>
            <div className='flex flex-row-reverse justify-between filter-icons'>
              <NetworkIcon sizeClassName='my-auto h-6 w-6 -ml-1' chainId={NETWORK.bsc} />
              <NetworkIcon sizeClassName='my-auto h-6 w-6 -ml-1' chainId={NETWORK.celo} />
              <NetworkIcon sizeClassName='my-auto h-6 w-6 -ml-1' chainId={NETWORK.polygon} />
              <NetworkIcon sizeClassName='my-auto h-6 w-6' chainId={NETWORK.mainnet} />
            </div>
            <span className='capitalize ml-2'>{t('allNetworks')}</span>
          </div>
        ),
        value: null
      }
    }
  )
}
