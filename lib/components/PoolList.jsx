import React from 'react'
import classnames from 'classnames'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { PoolRow } from 'lib/components/PoolRow'

export const PoolList = (
  props,
) => {
  const { omit, pools, selectedId } = props

  if (omit) {
    return null
  }

  return <>
    <AnimateSharedLayout>
      <AnimatePresence>
        <h6
          className={classnames(
            'text-accent-2 mb-8',
            {
              'mt-20': omit
            }
          )}
        >
          {omit ? 'Other Pools' : 'Pools'}
        </h6>
        
        <motion.ul
          key='pool-list'
          className='flex flex-col text-xs sm:text-lg lg:text-xl'
        >
          {pools.filter(_pool => omit !== _pool).map(pool => {
            if (!pool || !pool.poolAddress) {
              return null
            }

            const selected = selectedId === pool.poolAddress

            return <motion.li
              key={`pool-${pool.poolAddress}`}
              sharedId={`pool-${pool.poolAddress}`}
              animate='enter'
              variants={{
                enter: {
                  y: 0,
                  transition: {
                    duration: 0.1
                  }
                },
              }}
              whileHover={{
                y: selected ? 0 : -2
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
