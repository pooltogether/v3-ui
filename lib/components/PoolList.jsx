import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { PoolRowNew } from 'lib/components/PoolRowNew'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'

export const PoolList = (props) => {
  const { pools } = props

  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <motion.ul
          key='pool-list'
          className='flex flex-col text-xs sm:text-lg lg:text-xl'
          initial={{
            scale: 0,
            y: -100,
            opacity: 0,
            // transition: {
            //   duration: shouldReduceMotion ? 0 : 0.5,
            //   staggerChildren: shouldReduceMotion ? 0 : 0.05,
            //   staggerDirection: -1
            // }
          }}
          animate={{
            scale: 1,
            y: 0,
            opacity: 1,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.2,
              staggerChildren: shouldReduceMotion ? 0 : 0.5,
              delayChildren: shouldReduceMotion ? 0 : 0.2,
            },
          }}
          exit={{
            scale: 0,
            y: -100,
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.8,
              staggerChildren: shouldReduceMotion ? 0 : 0.05,
              staggerDirection: -1,
            },
          }}
        >
          {pools?.map((pool) => {
            if (!pool?.id) {
              return null
            }

            return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
          })}

          {/* <PoolRowGhost
          key={`pool-row-ghost`}
          pool={null}
        /> */}
        </motion.ul>
      </AnimatePresence>
    </>
  )
}
