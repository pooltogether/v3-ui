import React from 'react'
import { motion } from 'framer-motion'
import { AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { pools, selectedId } = props

  return <>
    <AnimateSharedLayout>
      <AnimatePresence>
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
          if (!pool.id) {
            return null
          }

          return <motion.li
            key={`pool-${pool.id}`}
            sharedId={`pool-${pool.id}`}
            animate
            transition={{ duration: 2, ease: "easeInOut" }}
            // positionTransition
            // layoutTransition={spring}
            // variants={{
            //   enter: {
            //     scale: 1,
            //     transition: {
            //       duration: 0.1
            //     }
            //   },
            //   // exit: {
            //   //   scale: 0.9,
            //   //   transition: {
            //   //     duration: 0.1
            //   //   }
            //   // },
            // }}
            // whileHover={{
            //   scale: 1.02
            // }}
            className='relative w-full'
          >
            <PoolRow
              pool={pool}
              selected={selectedId === pool.id}
            />
          </motion.li>
        })}
      </motion.ul>
      </AnimatePresence>
    </AnimateSharedLayout>
  </>

}
