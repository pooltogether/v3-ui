import classNames from 'classnames'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import React from 'react'

interface PagePaddingProps {
  children?: React.ReactNode
  className?: string
  maxWidthClassName?: string
}

/**
 * PagePadding includes default padding for pages & intro/outro animations
 * @param props
 * @returns
 */
export const PagePadding = (props: PagePaddingProps) => {
  const { className, maxWidthClassName, children } = props

  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      <motion.div
        id='modal-animation-wrapper'
        transition={{ duration: shouldReduceMotion ? 0 : 0.1, ease: 'easeIn' }}
        initial={{
          opacity: 0
        }}
        exit={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={classNames('px-2 pb-20 mx-auto', maxWidthClassName, className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

PagePadding.defaultProps = {
  maxWidthClassName: 'max-w-screen-sm'
}
