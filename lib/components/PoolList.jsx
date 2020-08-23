import React from 'react'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { pools } = props
  // const { pools, selectedId } = props

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
          // transition: { staggerChildren: 0.07, delayChildren: 0.2 }
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

          // const selected = selectedId === pool.poolAddress

          return <PoolRow
            key={`pool-${pool.poolAddress}`}
            pool={pool}
            // selected={selected}
          />
        })}
      </motion.ul>
    </AnimatePresence>
  </>

}
