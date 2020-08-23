import React from 'react'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { pools, selectedId } = props

  return <>
    {/* <AnimateSharedLayout> */}
      <AnimatePresence>
        <motion.ul
          key='pool-list'
          className='flex flex-col text-xs sm:text-lg lg:text-xl'
          animate='enter'
          variants={{
            initial: {
              scale: 0,
              y: 10,
              opacity: 0,
            },
            enter: {
              scale: 1,
              y: 0,
              opacity: 1,
              transition: {
                duration: 6,
                staggerChildren: 2
              }
            },
          }}
        >
          {pools.map(pool => {
            if (!pool || !pool.poolAddress) {
              return null
            }

            const selected = selectedId === pool.poolAddress

            return <PoolRow
              key={`pool-${pool.poolAddress}`}
              pool={pool}
              selected={selected}
            />
          })}
        </motion.ul>
      </AnimatePresence>
    {/* </AnimateSharedLayout> */}
  </>

}
