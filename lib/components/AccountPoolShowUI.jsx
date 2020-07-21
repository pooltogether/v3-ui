import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'

export const AccountPoolShowUI = (props) => {
  const router = useRouter()

  const authDataContext = useContext(AuthControllerContext)
  const { networkName } = authDataContext

  const poolData = useContext(PoolDataContext)
  const { pool, dynamicPlayerData } = poolData

  const poolAddress = pool && pool.id
  const ticker = pool && pool.underlyingCollateralSymbol

  let playerData
  if (dynamicPlayerData) {
    playerData = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)
  }

  let usersBalance = 0
  if (pool && playerData) {
    usersBalance = Number(ethers.utils.formatUnits(
      playerData.balance,
      pool.underlyingCollateralDecimals
    ))
  }

  const showPoolIndex = (e) => {
    e.preventDefault()
    router.push('/', '/', { shallow: true })
  }

  const handleShowWithdraw = (e) => {
    e.preventDefault()
    router.push(
      '/account/pools/[networkName]/[prizePoolTicker]/withdraw',
      `/account/pools/${networkName}/${ticker}/withdraw`,
      { shallow: true }
    )
  }

  const handleShowDeposit = (e) => {
    e.preventDefault()
    router.push(
      '/pools/[networkName]/[prizePoolTicker]/deposit',
      `/pools/${networkName}/${ticker}/deposit`,
      { shallow: true }
    )
  }

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center'
    >
      <div
        className='text-xl text-inverse'
      >
        {ticker} Pool
      </div>

      {!dynamicPlayerData ? <>
        <IndexUILoader />
      </> :
        !playerData ? <>
          <BlankStateMessage>
            <div
              className='mb-4'
            >
              You currently have no tickets in this pool.<br />Deposit now to get tickets!
            </div>
            
            <Button
              outline
              onClick={showPoolIndex}
            >
              View pools
            </Button>
          </BlankStateMessage>
        </> : <>
          <div
            className='mt-4'
          >
            <PoolCurrencyIcon
              pool={pool}
              className='inline-block w-12 h-12'
            />
          </div>

          <div
            className='mt-4 text-xl'
          >
            Tickets: <PoolCountUp
              end={usersBalance}
              decimals={null}
            />
          </div>
          <div
            className='mt-2 text-sm'
          >
            Odds of winning: <PoolCountUp
              end={1}
              decimals={null}
            /> in <PoolCountUp
              end={1234}
              decimals={null}
            />
          </div>

          <div
            className='my-6'
          >
            <PrizeAmount
              pool={pool}
            />
          </div>

          <div
            className='mt-4'
          >
            {pool.frequency} Pool
          </div>

          <div
            className='mb-4'
          >
            <PrizePoolCountdown />
          </div>

          <div
            className='flex justify-center items-center w-full mt-10 mx-auto'
          >
            <div className='mr-2'>
              <Button
                outline
                onClick={handleShowWithdraw}
                wide
              >
                Withdraw
              </Button>              
            </div>
            
            <Button
              outline
              onClick={handleShowDeposit}
              wide
            >
              Get more tickets
            </Button>
          </div>
        </>
      }
    </div>
  </>
}
