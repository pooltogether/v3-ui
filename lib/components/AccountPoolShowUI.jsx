import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Odds } from 'lib/components/Odds'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PTHint } from 'lib/components/PTHint'
import { TimelockedBalanceUI } from 'lib/components/TimelockedBalanceUI'

export const AccountPoolShowUI = (props) => {
  const router = useRouter()

  const poolData = useContext(PoolDataContext)
  const { pool, dynamicPlayerData } = poolData

  const poolIsLocked = pool?.isRngRequested

  const poolAddress = pool?.poolAddress
  const symbol = pool?.symbol
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  let playerData
  if (dynamicPlayerData) {
    playerData = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)
  }

  let usersBalance = 0
  if (pool && playerData && underlyingCollateralDecimals) {
    usersBalance = Number(ethers.utils.formatUnits(
      playerData.balance,
      Number(underlyingCollateralDecimals)
    ))
  }

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center'
    >
      <div
        className='mt-4'
      >
        <PoolCurrencyIcon
          pool={pool}
          className='inline-block w-12 h-12'
        />
        <div
          className='mt-2 mb-8 font-bold'
        >
          {pool?.name}
        </div>
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
            
            <ButtonLink
              outline
              href='/'
              as='/'
            >
              View pools
            </ButtonLink>
          </BlankStateMessage>
        </> : <>

          <div
            className='mt-4 text-xl'
          >
            Tickets: <PoolCountUp
              end={usersBalance}
              decimals={0}
            />
          </div>

          <TimelockedBalanceUI
            pool={pool}
            playerData={playerData}
          />

          {usersBalance > 0 && <>
            <div
              className='mt-1 text-sm'
            >
              <Odds
                showLabel
                pool={pool}
                usersBalance={usersBalance}
              />
            </div>
          </>}

          <div
            className='my-10'
          >
            <PrizeAmount
              pool={pool}
            />
          </div>

          <div
            className='mb-4 flex items-center justify-center'
          >
            <NewPrizeCountdown
              pool={pool}
            />
          </div>

          <div
            className='flex justify-center items-center w-full mt-10 mx-auto'
          >
            <div className='mr-2'>

              {poolIsLocked ? <>
                <PTHint
                  title='Pool is locked'
                  tip={<>
                    <div className='my-2 text-xs sm:text-sm'>
                      The Pool is currently being awarded. No deposits or withdrawals can be processed until it's complete.
                    </div>
                    <div
                      className='text-xs sm:text-sm'
                    >
                      You won't need to refresh the page.
                    </div>
                  </>}
                  className='w-full'
                >
                  <div
                    className='opacity-60 font-bold bg-body rounded-xl text-highlight-2 hover:text-highlight-1 border-2 border-highlight-2 hover:border-highlight-1 text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
                  >
                    Withdraw
                  </div>
                </PTHint>
              </> : <>
                <ButtonLink
                  wide
                  outline
                  onClick={handleShowWithdraw}
                  href='/account/pools/[symbol]/withdraw'
                  as={`/account/pools/${symbol}/withdraw`}
                >
                  Withdraw
                </ButtonLink>
              </>}
            </div>
            
            <ButtonLink
              wide
              outline
              href='/pools/[symbol]/deposit'
              as={`/pools/${symbol}/deposit`}
            >
              Get tickets
            </ButtonLink>
          </div>
        </>
      }
    </div>
  </>
}
