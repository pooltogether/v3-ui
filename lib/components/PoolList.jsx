import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { PoolRowNew } from 'lib/components/PoolRowNew'
// import { PoolRow } from 'lib/components/PoolRow'
import { PoolRowGhost } from 'lib/components/PoolRowGhost'

export const PoolList = (
  props,
) => {
  const { pools } = props

  return <>
    <AnimatePresence exitBeforeEnter>
      <motion.ul
        key='pool-list'
        className='flex flex-col text-xs sm:text-lg lg:text-xl'
        initial={{
          scale: 0,
          y: -100,
          opacity: 0,
          transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.2,
            staggerChildren: 0.5,
            delayChildren: 0.2
          }
        }}
        exit={{
          scale: 0,
          y: -100,
          opacity: 0,
          transition: {
            duration: 0.8,
            staggerChildren: 0.05,
            staggerDirection: -1 
          }
        }}
      >
        {pools.map(pool => {
          if (!pool || !pool.poolAddress) {
            return null
          }

          return <PoolRowNew
            key={`pool-row-${pool.poolAddress}`}
            pool={pool}
          />
          // return <PoolRow
          //   key={`pool-row-${pool.poolAddress}`}
          //   pool={pool}
          // />
        })}

        <PoolRowGhost
          key={`pool-row-ghost`}
          pool={null}
        />
      </motion.ul>
    </AnimatePresence>
  </>

}
