import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { sendTx } from 'lib/utils/sendTx'

export const TimelockedBalanceUI = (props) => {
  const {
    pool,
    playerData,
  } = props

  const authContext = useContext(AuthControllerContext)
  const { provider, usersAddress } = authContext

  // TODO! If there's a sweep tx in flight then show the button as disabled
  
  console.log({ pool})
  const { poolAddress } = pool
  console.log({ playerData })

  const [tx, setTx] = useState({})
  const txInFlight = tx.inWallet || tx.sent && !tx.completed

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  const ticker = pool && pool.underlyingCollateralSymbol
  const tickerUpcased = ticker && ticker.toUpperCase()

  const currentUnixTimestamp = parseInt(Date.now() / 1000, 10)

  let formattedFutureDate
  let usersTimelockedBalance = 0
  let timelockSweepReady = false

  if (pool && playerData && underlyingCollateralDecimals) {
    usersTimelockedBalance = Number(ethers.utils.formatUnits(
      playerData.timelockedBalance,
      Number(underlyingCollateralDecimals)
    ))

    if (playerData.unlockTimestamp) {
      const unlockUnixTimestamp = parseInt(playerData.unlockTimestamp, 10)

      timelockSweepReady = (currentUnixTimestamp - unlockUnixTimestamp > 0)
      formattedFutureDate = formatFutureDateInSeconds(
        unlockUnixTimestamp - currentUnixTimestamp
      )
    }
  }

  const handleSweepTimelocked = async (e) => {
    e.preventDefault()

    const params = [
      [usersAddress],
      {
        gasLimit: 500000
      }
    ]

    await sendTx(
      setTx,
      provider,
      poolAddress,
      PrizePoolAbi,
      'sweepTimelockBalances',
      params,
      'Sweep timelocked funds'
    )
  }

  return <>
    {usersTimelockedBalance > 0 && <>
      <div
        className='mt-6 text-sm border-t-2 border-b-2 py-4'
      >
        <div>
          Timelocked balance: $<PoolCountUp
            end={usersTimelockedBalance}
            decimals={0}
          /> {tickerUpcased}
        </div>

        <div className='text-xxs sm:text-xs'>
          Ready for withdraw{timelockSweepReady ? <>
            ! <div className='mt-2'>
                <Button
                  outline
                  blue
                  onClick={handleSweepTimelocked}
                >
                  Sweep timelocked funds
                </Button>
              </div>
          </> : <>
            &nbsp;in: {formattedFutureDate}
          </>}
        </div>
      </div>
    </>}
  </>
}
