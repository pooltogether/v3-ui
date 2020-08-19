import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { FormattedFutureDateCountdown } from 'lib/components/FormattedFutureDateCountdown'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const TimelockedBalanceUI = (props) => {
  const {
    pool,
    playerData,
  } = props

  const authContext = useContext(AuthControllerContext)
  const { provider, usersAddress } = authContext
  
  const poolAddress = pool?.poolAddress

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  const ticker = pool && pool.underlyingCollateralSymbol
  const tickerUpcased = ticker && ticker.toUpperCase()

  const currentUnixTimestamp = parseInt(Date.now() / 1000, 10)

  let formattedFutureDate
  let usersTimelockedBalance = 0
  let timelockSweepReady = false


  const [txId, setTxId] = useState()

  const txName = `Return timelocked funds`
  const method = 'sweepTimelockBalances'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)



  if (pool && playerData && underlyingCollateralDecimals) {
    usersTimelockedBalance = Number(ethers.utils.formatUnits(
      playerData.timelockedBalance,
      Number(underlyingCollateralDecimals)
    ))

    if (playerData.unlockTimestamp) {
      const unlockUnixTimestamp = parseInt(playerData.unlockTimestamp, 10)

      timelockSweepReady = (currentUnixTimestamp - unlockUnixTimestamp > 0)
      formattedFutureDate = <FormattedFutureDateCountdown
        futureDate={unlockUnixTimestamp - currentUnixTimestamp}
      />
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

    const id = sendTx(
      provider,
      PrizePoolAbi,
      poolAddress,
      method,
      params
    )
    setTxId(id)
  }
  
  return <>
    {usersTimelockedBalance > 0 && <>
      <div
        className='mt-6 mb-6 text-sm border-t-2 border-b-2 py-6'
      >
        <h4>
          Your timelocked balance
        </h4>
        <div
          className='font-bold'
        >
          $<PoolCountUp
            end={usersTimelockedBalance}
            decimals={0}
          /> {tickerUpcased}
        </div>

        <div className='text-xs sm:text-sm lg:text-lg mt-2'>
          Ready to withdraw{timelockSweepReady ? <>
            ! <div className='mt-2'>
                <Button
                  onClick={handleSweepTimelocked}
                  disabled={tx?.sent && !tx?.completed}
                >
                  Sweep timelocked funds
                </Button>
              </div>
          </> : <>
            &nbsp;in: <div className='font-bold'>{formattedFutureDate}</div>
          </>}
        </div>
      </div>
    </>}
  </>
}
