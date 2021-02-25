import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { motion } from 'framer-motion'

export const InteractableCard = (props) => {
  const id = props.id
  const selected = props.selected
  const className = props.className

  return (
    <>
      <motion.li
        layout
        onClick={props.onClick}
        whileTap={{ y: 1, scale: 0.98 }}
        className={classnames(
          className,
          'interactable-card bg-card hover:bg-card-selected border-card w-full mb-4 rounded-lg text-inverse hover:text-inverse trans trans-fast',
          {
            'hover:shadow-xl cursor-pointer': !selected,
            'selected': selected,
          }
        )}
        style={{
          minHeight: 120,
        }}
      >
        <Link href={props.href} as={props.as}>
          <motion.a layout id={id} className='p-4 xs:px-6 xs:py-4 inline-block w-full'>
            {props.children}
          </motion.a>
        </Link>
      </motion.li>
    </>
  )
}
