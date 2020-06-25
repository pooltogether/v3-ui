import React from 'react'
import { motion } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { pools } = props

  return <motion.div
    className='flex flex-col -mx-2 text-xs sm:text-lg lg:text-xl'
    initial='initial'
    animate='enter'
    exit='exit'
    variants={{
      // exit: {
      //   // scale: 0.6,
      //   // y: 100,
      //   opacity: 0,
      //   transition: {
      //     duration: 0.5,
      //     staggerChildren: 0.1 
      //   } 
      // },
      enter: {
        transition: {
          duration: 0.5,
          staggerChildren: 0.1
        }
      },
      initial: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.2
        }
      }
    }}
  >
    {pools.map(pool => (
      <PoolRow
        key={pool.id}
        pool={pool}
      />
    ))}
  </motion.div>

}
