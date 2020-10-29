import React, { useContext, useEffect } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { handleCloseWizard } from 'lib/utils/handleCloseWizard'

function range1(i) { return i ? range1(i - 1).concat(i) : [] }

export const WizardLayout = (props) => {
  const {
    currentWizardStep,
    handlePreviousStep,
    moveToStep,
    totalWizardSteps,
    children
  } = props

  const poolData = useContext(PoolDataContext)

  const router = useRouter()
  const action = router.asPath.match('withdraw') ? 'withdraw' : 'deposit'

  const handleClose = () => {
    handleCloseWizard(router)
  }

  // could easily refactor into a custom hook
  useEffect(() => {
    const escToClose = (e) => {
      if (e.keyCode === 27) {
        handleClose()
      }
    }

    document.addEventListener('keydown', escToClose)

    return () => {
      document.removeEventListener('keydown', escToClose)
    }
  }, [])

  const disabled = currentWizardStep <= 1 || currentWizardStep >= totalWizardSteps

  return <>
    <motion.div
      key={`${action}-scaled-bg`}
      className='fixed w-full h-full z-40 bg-darkened'
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: {
        duration: 0.25,
        delay: 0.25,
      } }}
    />
    
    <motion.div
      key={`${action}-pane`}
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 z-50'
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <nav
        className='fixed t-0 l-0 r-0 w-full px-4 pt-4 flex items-start justify-between h-20'
      >
        <button
          disabled={disabled}
          type='button'
          onClick={handlePreviousStep}
          className={classnames(
            'text-inverse hover:opacity-100 trans outline-none focus:outline-none active:outline-none',
            {
              'opacity-70': !disabled,
              'opacity-30': disabled
            }
          )}
        >
          <FeatherIcon
            icon='arrow-left-circle'
            className='w-8 h-8 sm:w-16 sm:h-16'
            strokeWidth='0.09rem'
          />
        </button>
      
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key='wizard-step-count-parent'
          className='flex'
          variants={{
            enter: {
              y: 13,
              transition: {
                when: 'beforeChildren',
                staggerChildren: 0.4,
              },
            },
            exit: { y: -70 },
          }}
          initial='exit'
          exit='exit'
          animate='enter'
        >
            {range1(totalWizardSteps).map((stepNum, index) => {
              return <motion.div
                key={`step-counter-${index+1}`}
                exit={{ scaleX: 0, transition: { duration: 1 } }}
                onClick={(e) => {
                  e.preventDefault()

                  if (currentWizardStep < index + 1) {
                    return
                  }

                  moveToStep(index)
                }}
                className={classnames(
                  'cursor-pointer w-8 h-2 rounded-sm mx-1',
                  {
                    'bg-default': currentWizardStep < index + 1,
                    'bg-purple': currentWizardStep >= index + 1,
                  }
                )}
              />
            })}
          </motion.div>
        </AnimatePresence>

        <button
          type='button'
          onClick={handleClose}
          className='text-inverse opacity-70 hover:opacity-100 trans outline-none focus:outline-none active:outline-none'
        >
          <FeatherIcon
            icon='x-circle'
            className='w-8 h-8 sm:w-16 sm:h-16'
            strokeWidth='0.09rem'
          />
        </button>
      </nav>

      <div
        className='h-full flex flex-col justify-center px-4 xs:px-12 sm:px-36 lg:px-48 text-center mx-auto'
        style={{
          maxWidth: 1160
        }}
      >
        {children}
      </div>

      {/* <div
        className='fixed b-0 l-0 r-0 w-full px-4 pb-16 flex flex-col items-center justify-center h-20'
      >
       <div className='mb-2'>
          <PoolCurrencyIcon
            pool={poolData.pool}
          />
        </div>

         <div
          className='text-inverse bg-primary rounded-lg px-2 uppercase text-xxs sm:text-sm font-bold'
        >
          {poolData.pool && <>
            {poolData.pool.name}
          </>}
        </div> 
      </div> */}
    </motion.div>
  </>
}
