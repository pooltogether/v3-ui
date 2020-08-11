import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'

import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'

export const Settings = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleSettingsPanel = (e) => {
    e.preventDefault()

    setIsOpen(!isOpen)
  }
  
  return <>
    <button
      onClick={toggleSettingsPanel}
      className={classnames(
        'hover:text-highlight-2',
        {
          'text-highlight': !isOpen,
          'text-highlight-2': isOpen,
        }
      )}
    >
      <FeatherIcon
        icon='settings'
        className='w-6 h-6'
        strokeWidth='2'
      />
    </button>

    <motion.div
      className='bg-default h-full absolute t-0 b-0 z-20 p-4 sm:p-6 shadow-md'
      style={{
        height: 'calc(100vh - 220px)',
        right: -30,
        top: 78,
        width: 300
      }}
      animate={isOpen ? 'enter' : 'exit'}
      initial='initial'
      variants={{
        exit: {
          x: 300,
          opacity: 0,
          transition: {
            staggerChildren: 0.1
          }
        },
        enter: {
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.1,
            staggerChildren: 0.1
          }
        },
        initial: {
          x: 0,
          opacity: 0,
        }
      }}
    >
      <label
        className='uppercase text-caption font-number pb-1'
      >
        Theme:
      </label>
      <ThemeSwitcher />
    </motion.div>
  </>
}