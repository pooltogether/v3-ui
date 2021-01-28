import React, { useContext, useEffect, useState } from 'react'
import { Wizard, useWizard } from 'react-wizard-primitive'
import { atom, useAtom } from 'jotai'

import { AnimatePresence } from 'framer-motion'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { ConfettiContext } from 'lib/components/contextProviders/ConfettiContextProvider'
import Link from 'next/link'
import MerkleDistributorAbi from 'abis/MerkleDistributor'
import { TxStatus } from 'lib/components/TxStatus'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { WizardLayout } from 'lib/components/WizardLayout'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTranslation } from 'i18n/client'

export const showClaimWizardAtom = atom(false)

export const ClaimRetroactivePoolWizardContainer = () => {
  const [showWizard, setShowWizard] = useAtom(showClaimWizardAtom)
  const closeWizard = () => setShowWizard(false)

  if (!showWizard) {
    return null
  }

  return (
    <AnimatePresence>
      <ClaimRetroactivePoolWizard closeWizard={closeWizard} />
    </AnimatePresence>
  )
}

const ClaimRetroactivePoolWizard = props => {
  return (
    <Wizard>
      <ClaimRetroactivePoolWizardStepManager {...props} />
    </Wizard>
  )
}

const ClaimRetroactivePoolWizardStepManager = props => {
  const { closeWizard } = props
  const { activeStepIndex, previousStep, moveToStep, nextStep } = useWizard()

  const { data, refetch, loading } = useRetroactivePoolClaimData()

  return (
    <WizardLayout
      currentWizardStep={activeStepIndex + 1}
      handlePreviousStep={previousStep}
      moveToStep={moveToStep}
      totalWizardSteps={3}
      closeWizard={closeWizard}
    >
      <div className='text-inverse'>
        <StepOne nextStep={nextStep} isActive={activeStepIndex === 0} key={1} />
        <StepTwo nextStep={nextStep} isActive={activeStepIndex === 1} key={2} />
        <StepThree
          key={3}
          claimData={data}
          loading={loading}
          nextStep={nextStep}
          isActive={activeStepIndex === 2}
          refetch={refetch}
          closeWizard={closeWizard}
        />
      </div>
    </WizardLayout>
  )
}

const StepOne = props => {
  const { nextStep, isActive } = props

  const [checked, setChecked] = useState(false)

  if (!isActive) {
    return null
  }

  return (
    <div className='mx-auto' style={{ maxWidth: '550px' }}>
      <WizardBanner>
        <h4 className='mb-4'>Why are you receiving POOL?</h4>
        <p className='text-xs xs:text-sm text-accent-1'>
          You are receiving the POOL token because you have used the
          PoolTogether Protocol. All users of the protocol now completely
          control all decisions. The POOL token has no value and is used for
          governing.{' '}
        </p>
        <CheckboxContainer>
          <CheckboxInputGroup
            marginClasses='mx-auto my-0'
            id='receiving-i-understand'
            name='receiving-i-understand'
            label='I understand why I am receiving tokens'
            title=''
            checked={checked}
            handleClick={() => setChecked(!checked)}
          />
        </CheckboxContainer>
      </WizardBanner>

      <ButtonDrawer>
        <Button
          onClick={nextStep}
          textSize='lg'
          className='w-full'
          disabled={!checked}
        >
          Next
        </Button>
      </ButtonDrawer>
    </div>
  )
}

const StepTwo = props => {
  const { nextStep, isActive } = props

  const [checked, setChecked] = useState(false)

  if (!isActive) {
    return null
  }

  return (
    <div className='mx-auto' style={{ maxWidth: '550px' }}>
      <WizardBanner>
        <h4 className='mb-4'>What do POOL tokens do?</h4>
        <p className='text-xs xs:text-sm text-accent-1'>
          The POOL token is used to vote on decisions for the protocol. For
          example, how many winners should a prize pool have? Should a new prize
          pool be created? Any protocol changes are voted on by the POOL
          holders.
        </p>
        <CheckboxContainer>
          <CheckboxInputGroup
            marginClasses='mx-auto my-0'
            id='uses-i-understand'
            name='uses-i-understand'
            label='I understand what tokens do'
            title=''
            checked={checked}
            handleClick={() => setChecked(!checked)}
          />
        </CheckboxContainer>
      </WizardBanner>

      <ButtonDrawer>
        <Button
          onClick={nextStep}
          textSize='lg'
          className='w-full'
          disabled={!checked}
        >
          Next
        </Button>
      </ButtonDrawer>
    </div>
  )
}

const StepThree = props => {
  const { t } = useTranslation()
  const { closeWizard, isActive, claimData, refetch, loading } = props

  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction(
    `Claim POOL`,
    transactions,
    setTransactions
  )
  const txInFlight = transactions?.find(tx => tx.id === txId)
  const txPending =
    (txInFlight?.sent || txInFlight?.inWallet) && !txInFlight?.completed

  useEffect(() => {
    if (txInFlight?.completed) {
      refetch()
    }
  }, [txInFlight?.completed])

  if (!isActive) {
    return null
  }

  if (loading) {
    return <V3LoadingDots />
  }

  if (!claimData) {
    return null
  }

  const { amount, formattedAmount, index, proof } = claimData

  const handleClaim = async e => {
    e.preventDefault()

    const params = [index, usersAddress, amount, proof]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      MerkleDistributorAbi,
      CONTRACT_ADDRESSES[chainId].MerkleDistributor,
      'claim',
      params
    )
    setTxId(id)
  }

  const amountWithCommas = numberWithCommas(formattedAmount)

  if (txPending || txInFlight?.error) {
    return (
      <div className='mx-auto' style={{ maxWidth: '550px' }}>
        <h3>You are receiving</h3>
        <h2 className='text-highlight-1 mb-8'>🎉 {amountWithCommas} POOL 🎉</h2>

        <TxStatus tx={txInFlight} />
      </div>
    )
  }

  if (txInFlight?.completed && !txInFlight?.error && !txInFlight?.cancelled) {
    return (
      <ClaimCompleted amount={amountWithCommas} closeWizard={closeWizard} />
    )
  }

  return (
    <div className='mx-auto' style={{ maxWidth: '550px' }}>
      <h3>You are receiving</h3>
      <h2 className='text-highlight-1 mb-8'>🎉 {amountWithCommas} POOL 🎉</h2>
      <Button onClick={handleClaim} textSize='lg' className='w-full'>
        Claim My Tokens
      </Button>
    </div>
  )
}

const ClaimCompleted = props => {
  const { closeWizard, amount } = props
  const { confetti } = useContext(ConfettiContext)

  useEffect(() => {
    const key = setTimeout(() => {
      window.confettiContext = confetti
      confetti.start(setTimeout, setInterval)
    }, 300)

    return () => {
      clearTimeout(key)
    }
  }, [])

  const onClick = e => {
    closeWizard()
  }

  return (
    <div className='mx-auto' style={{ maxWidth: '550px' }}>
      <h3>🎉 🎉 🎉</h3>
      <h3>Successfully Claimed!!</h3>
      <h2 className='text-highlight-1 mb-8'>{amount} POOL</h2>
      <WizardBanner>
        <h4 className='mb-4'>Now let's use these tokens!</h4>
        <p className='text-xs xs:text-sm text-accent-1 mb-4 sm:mb-8'>
          It can be used to do things and stuff. These things are very cool.
          They will let you make decisions about the stuff.
        </p>
        <div className='flex flex-row'>
          <ProposalButton onClick={onClick} />
          <LearnMoreButton onClick={onClick} />
        </div>
      </WizardBanner>
    </div>
  )
}

const WizardBanner = props => (
  <Banner className='mx-auto mb-4 sm:mb-12'>{props.children}</Banner>
)

const CheckboxContainer = props => (
  <div
    // style={{ maxWidth: '477px' }}
    className='flex mx-auto px-4 py-2 sm:px-8 sm:py-2 mt-4 text-inverse rounded-lg font-bold'
  >
    {props.children}
  </div>
)

const ProposalButton = props => {
  const { onClick, children } = props

  return (
    <Link href='/vote'>
      <a
        href='/vote'
        onClick={onClick}
        className='p-8 mr-4 bg-card w-full flex flex-col rounded-lg'
      >
        <svg
          style={{
            transform: 'scale(1.15)'
          }}
          className='fill-current w-8 h-8 sm:w-16 sm:h-16 stroke-1 stroke-current mx-auto relative'
          width='20'
          height='25'
          viewBox='0 0 20 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M16.994 10.3965C16.9924 10.3869 16.9903 10.3776 16.988 10.3682C16.9854 10.3575 16.9847 10.3466 16.9811 10.3361L15.101 4.78371C15.0514 4.63717 14.9176 4.53904 14.7675 4.53904H11.3679L8.04561 1.1069C7.90755 0.964407 7.68401 0.964288 7.54595 1.10702L4.89902 3.84348C4.83275 3.91199 4.79547 4.00488 4.79547 4.10182C4.79547 4.19876 4.83275 4.29165 4.89902 4.36016L5.07221 4.53904H3.23034C3.08009 4.53904 2.94629 4.63729 2.8967 4.78394L1.01979 10.3363C1.01752 10.343 1.0173 10.3501 1.01543 10.3569C1.011 10.3727 1.00746 10.3887 1.00512 10.4054C1.00364 10.4161 1.00256 10.4267 1.002 10.4375C1.00163 10.4445 1 10.451 1 10.458V19.6346C1 19.8365 1.15819 20 1.35343 20H16.6466C16.8418 20 17 19.8365 17 19.6346V10.458C17 10.4539 16.999 10.4502 16.9988 10.4461C16.9984 10.4295 16.9967 10.4131 16.994 10.3965ZM7.79595 1.88191L11.4957 5.70383L9.93702 7.31523H8.76018L5.64879 4.10182L7.79595 1.88191ZM3.48126 5.26981H5.77914L7.75993 7.31523H6.71461C6.51937 7.31523 6.36118 7.47878 6.36118 7.68062C6.36118 7.88246 6.51937 8.04601 6.71461 8.04601H8.61395H10.0834H11.2864C11.4817 8.04601 11.6399 7.88246 11.6399 7.68062C11.6399 7.47878 11.4817 7.31523 11.2864 7.31523H10.9366L12.2454 5.96217C12.3834 5.81956 12.3834 5.58822 12.2454 5.44549L12.0756 5.26981H14.5168L16.1494 10.0914H1.85136L3.48126 5.26981ZM16.2931 19.2692H1.70686V10.8234H16.2931V19.2692V19.2692Z'
            strokeWidth='0.5'
          />
        </svg>
        <h4>Vote</h4>
      </a>
    </Link>
  )
}

const LearnMoreButton = props => {
  const { onClick, children } = props

  return (
    <Link href='/vote'>
      <a
        href='/vote'
        onClick={onClick}
        className='p-8 ml-4 bg-card w-full flex flex-col rounded-lg'
      >
        <svg
          className='fill-current w-8 h-8 sm:w-16 sm:h-16 stroke-1 stroke-current mx-auto relative'
          width='69'
          height='52'
          viewBox='0 0 69 52'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M56.6785 17.3795L57.4387 15.0073C48.4845 11.5588 39.9217 14.8682 39.5615 15.0107L40.3409 17.3762C40.4219 17.3443 48.4875 14.2261 56.6785 17.3795Z' />
          <path d='M56.6785 24.924L57.4395 22.5517C48.4852 19.1032 39.9225 22.4126 39.5615 22.5551L40.3416 24.9206C40.4212 24.8896 48.4875 21.7697 56.6785 24.924Z' />
          <path d='M57.4395 30.0951C48.4852 26.6457 39.9225 29.9559 39.5615 30.0984L40.3416 32.4639C40.4219 32.4321 48.4883 29.313 56.6785 32.4673L57.4395 30.0951Z' />
          <path d='M28.9266 17.3795L29.6868 15.0073C20.7325 11.5588 12.169 14.8682 11.8096 15.0107L12.5889 17.3762C12.6707 17.3443 20.7356 14.2261 28.9266 17.3795Z' />
          <path d='M63.5283 3.00309L62.7612 2.7072C58.4906 1.06257 53.8383 0.228516 48.9344 0.228516C41.6963 0.228516 36.1324 2.02738 34.6326 2.56469C30.466 1.01395 25.9429 0.228516 21.1828 0.228516C12.8557 0.228516 6.74414 2.60912 6.48793 2.71055L5.73001 3.01064V5.55218H0.977539V51.1927H68.28V5.55302H63.5283V3.00309ZM35.776 4.81034C37.613 4.19926 42.6515 2.74324 48.9344 2.74324C53.2853 2.74324 57.4191 3.43311 61.2339 4.79525V42.7693C57.3892 41.4884 53.2601 40.8388 48.9344 40.8388C42.9529 40.8388 38.1224 42.0651 35.776 42.7952V4.81034ZM8.02441 4.80783C9.86758 4.19591 14.8954 2.74324 21.1828 2.74324C25.5353 2.74324 29.666 3.44233 33.4823 4.80531V42.7776C29.6369 41.496 25.5093 40.8388 21.1828 40.8388C15.2074 40.8388 10.3731 42.0643 8.02441 42.7944V28.8746L9.16703 32.1303L14.6506 38.8404L14.6269 31.8503C17.5469 31.1219 23.2049 30.2635 28.9272 32.4673L29.6882 30.095C23.608 27.753 17.7114 28.5275 14.438 29.3096L12.8625 24.8217C14.331 24.3137 21.5767 22.0924 28.9272 24.9231L29.6882 22.5509C21.4161 19.3647 13.4828 21.9448 12.0373 22.4687L8.02518 11.0343V4.80783H8.02441ZM6.07417 12.4828L8.02441 18.0403L12.2048 29.9542L12.3272 30.3038L12.3318 31.6835L12.3333 32.2359L11.1563 30.7958L8.02365 21.8677L5.72925 15.3294L4.90326 12.9756L5.72925 12.6269L6.07417 12.4828ZM3.27194 8.06775H5.72925V9.93367L3.27194 10.9697V8.06775ZM65.9856 8.06775V48.678H3.27194V15.3319L5.72925 22.3354V46.2949L7.26573 45.6863C7.32462 45.6629 13.2511 43.3535 21.182 43.3535C25.8267 43.3535 30.2228 44.1398 34.2479 45.6897L34.6334 45.8389L35.0173 45.6863C35.0762 45.6629 41.0026 43.3535 48.9328 43.3535C53.5775 43.3535 57.9736 44.1398 61.9995 45.6897L63.5268 46.2781V8.06775H65.9856Z' />
        </svg>
        <h4>Learn More</h4>
      </a>
    </Link>
  )
}
