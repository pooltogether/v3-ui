import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import VisuallyHidden from '@reach/visually-hidden'
import { motion } from 'framer-motion'

import { SHOW_MANAGE_LINKS } from 'lib/constants'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'

export const Settings = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const [showManageLinks, setShowManageLinks] = useState(false)
  useEffect(() => {
    const cookieShowAward = Cookies.get(SHOW_MANAGE_LINKS)
    setShowManageLinks(cookieShowAward)
  }, [])

  const handleShowManageLinksClick = (e) => {
    e.preventDefault()

    if (showManageLinks) {
      Cookies.remove(SHOW_MANAGE_LINKS)
    } else {
      Cookies.set(SHOW_MANAGE_LINKS, 1)
    }

    setShowManageLinks(!showManageLinks)
  }

  const toggleSettingsPanel = (e) => {
    e.preventDefault()

    setIsOpen(!isOpen)
  }
  
  return <>
    <button
      onClick={toggleSettingsPanel}
      className={classnames(
        'w-6 h-6 sm:w-8 sm:h-8 hover:text-highlight-1',
        {
          'text-highlight-2': !isOpen,
          'text-highlight-1': isOpen,
        }
      )}
    >
      <FeatherIcon
        icon='settings'
        className='w-6 h-6 sm:w-8 sm:h-8'
        strokeWidth='0.09rem'
      />
    </button>

    <motion.div
      key='settings-overlay'
      onClick={toggleSettingsPanel}
      className={classnames(
        'fixed t-0 l-0 r-0 b-0 w-full h-full z-30 bg-overlay bg-blur',
        {
          'pointer-events-none': !isOpen
        }
      )}
      animate={isOpen ? 'enter' : 'exit'}
      initial='initial'
      variants={{
        exit: {
          opacity: 0,
          transition: {
            duration: 0.1,
          }
        },
        enter: {
          opacity: 1,
          transition: {
            duration: 0.1,
          }
        },
        initial: {
          opacity: 0,
        }
      }}
    />

    <motion.div
      className='bg-highlight-3 h-full fixed t-0 b-0 z-40 px-10 pr-16 py-8 shadow-md rounded-xl'
      style={{
        height: '40vh',
        right: -30,
        top: '12vh',
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
      <button
        onClick={toggleSettingsPanel}
        className='absolute close-button text-highlight-2 hover:text-green trans outline-none focus:outline-none active:outline-none'
        style={{
          right: 50,
          top: 35
        }}
      >
        <VisuallyHidden>
          Close
        </VisuallyHidden>
        <span
          aria-hidden
        >
          <FeatherIcon
            icon='x-circle'
            className='w-6 h-6'
          />
        </span>
      </button>

      <h6
        className='text-white'
      >
        Settings
      </h6>
      <label
        className='uppercase text-caption font-number pb-1'
      >
        Theme:
      </label>
      <ThemeSwitcher />


      <label
        className='uppercase text-caption font-number pb-1'
      >
        Manage:
      </label>
      <div
        className='flex flex-col sm:flex-wrap sm:flex-row items-center justify-start text-center'
      >
        <CheckboxInputGroup
          large
          id='settings-show-award'
          name='settings-show-award'
          label={<>
            Show Manage Pool links
          </>}
          checked={showManageLinks}
          handleClick={handleShowManageLinksClick}
        />
      </div>
    </motion.div>
  </>
}