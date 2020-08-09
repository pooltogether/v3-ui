import React from 'react'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { pools, selectedId } = props

  return <>
    <AnimateSharedLayout>
      <AnimatePresence>
        <h2
          className='text-primary'
        >
          Active Pools
        </h2>
        
        <motion.ul
          key='pool-list'
          className='flex flex-col text-xs sm:text-lg lg:text-xl'
          // initial='initial'
          // animate='enter'
          // exit='exit'
          // variants={{
          //   // exit: {
          //   //   // scale: 0.6,
          //   //   // y: 100,
          //   //   opacity: 0,
          //   //   transition: {
          //   //     duration: 0.5,
          //   //     staggerChildren: 0.1 
          //   //   } 
          //   // },
          //   enter: {
          //     transition: {
          //       duration: 0.5,
          //       staggerChildren: 0.1
          //     }
          //   },
          //   initial: {
          //     y: 0,
          //     opacity: 1,
          //     transition: {
          //       duration: 0.2
          //     }
          //   }
          // }}
        >
          {pools.map(pool => {
            if (!pool || !pool.poolAddress) {
              return null
            }

            const selected = selectedId === pool.poolAddress

            return <motion.li
              key={`pool-${pool.poolAddress}`}
              sharedId={`pool-${pool.poolAddress}`}
              animate='enter'
              // positionTransition
              // layoutTransition={spring}
              variants={{
                enter: {
                  y: 0,
                  transition: {
                    duration: 0.1
                  }
                },
                // exit: {
                //   scale: 0.9,
                //   transition: {
                //     duration: 0.1
                //   }
                // },
              }}
              whileHover={{
                y: selected ? 0 : -4
              }}
              className='relative w-full'
            >
              <PoolRow
                pool={pool}
                selected={selected}
              />
            </motion.li>
          })}
        </motion.ul>
      </AnimatePresence>
    </AnimateSharedLayout>
  </>

}
