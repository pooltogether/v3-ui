import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolList } from 'lib/components/PoolList'
import { Tagline } from 'lib/components/Tagline'
import { V2MessageLarge } from 'lib/components/V2MessageLarge'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export const IndexUI = (
  props,
) => {
  const { t } = useTranslation()
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    pools,
    // pool,
  } = poolDataContext

  let totalPrizes = ethers.utils.bigNumberify(0)
  pools?.forEach(_pool => {
    const decimals = _pool?.underlyingCollateralDecimals

    const cumulativePrizeAmountsForPool = normalizeTo18Decimals(
      _pool.prizeEstimate,
      decimals
    )

    totalPrizes = totalPrizes.add(
      cumulativePrizeAmountsForPool
    )
  })

  return <>
    <V2MessageLarge />

    {/* <motion.h1
      animate={totalPrizes.gt(0) ? 'enter' : 'exit'}
      initial='exit'
      variants={{
        enter: {
          scale: 1,
          height: 'auto',
          transition: {
            duration: 0.25
          }
        },
        exit: {
          scale: 0,
          height: 0,
        }
      }}
      className='banner-text mx-auto font-bold text-center'
    > */}
      {/* You could <span className='text-flashy'>win $4,527 every week</span> just by saving your money. */}
      {/* <Trans
        i18nKey='youCouldWin'
        defaults='You could <flashy>win ${{totalPrizes}} every week</flashy> just by saving your money.'
        values={{ totalPrizes: displayAmountInEther(totalPrizes, { precision: 0 }) }}
        components={{
          flashy: <span className='text-flashy' />
        }}
      /> */}
    {/* </motion.h1> */}

    <h6
      className='text-accent-2 mb-6 capitalize'
    >
      {t('pools')}
    </h6>

    {loading ?
      <IndexUILoader /> :
      <PoolList
        pools={pools}
      />
    }

    <Tagline />
  </>
}
