import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { motion } from 'framer-motion'

export const InteractableCard = (
  props,
) => {  
  const selected = props.selected

  console.log(props)

  return <>
    <motion.li
      onClick={props.onClick}

      whileHover={{
        y: selected ? 0 : -2
      }}
      whileTap={{ y: 1, scale: 0.98 }}
      className={classnames(
        'interactable-card bg-card hover:bg-card-selected border-card w-full px-4 mb-3 py-5 trans rounded-lg text-inverse hover:text-inverse',
        {
          'border-card hover:shadow-xl cursor-pointer': !selected,
          'border-card border-dashed': selected,
        }
      )}
      style={{
        minHeight: 120
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
        y: -10,
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
      }}
    // variants={{
    //   exit: {
    //     y: 50,
    //     opacity: 0,
    //     transition: {
    //       y: { stiffness: 1000 }
    //     }
    //   },
    //   animate: {
    //     y: 0,
    //     opacity: 1,
    //     transition: {
    //       y: { stiffness: 1000, velocity: -100 }
    //     }
    //   },
    //   // initial: {
    //   //   scale: 0,
    //   // }
    // }}
    >
      <Link
        href={props.href}
        as={props.as}
      >
        <a
          // className='border border-card shadow-md hover:shadow-xl bg-card hover:bg-card-selected cursor-pointer border border-transparent w-full px-3 sm:px-4 sm:px-4 mb-3 py-3 sm:py-4 inline-block trans rounded-lg border-0 text-inverse'
          // style={{
          //   minHeight: 120
          // }}
        >
          {props.children}
        </a>
      </Link>
    </motion.li>
  </>
}
