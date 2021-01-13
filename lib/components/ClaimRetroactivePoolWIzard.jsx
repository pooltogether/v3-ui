import { AnimatePresence } from 'framer-motion'
import FeatherIcon from 'feather-icons-react'
import { atom, useAtom } from 'jotai'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { Meta } from 'lib/components/Meta'
import { WizardLayout } from 'lib/components/WizardLayout'
import Link from 'next/link'
import React, { useState } from 'react'
import { useWizard, useWizardStep, Wizard } from 'react-wizard-primitive'

export const showClaimWizardAtom = atom(false)

export const ClaimRetroactivePoolWizardContainer = () => {
  const [showWizard, setShowWizard] = useAtom(showClaimWizardAtom)
  const closeWizard = () => setShowWizard(false)

  return <AnimatePresence>
    <Meta key={1} title='Claim POOL'/>
    {showWizard && <ClaimRetroactivePoolWizard key={2} closeWizard={closeWizard} />}
  </AnimatePresence>
}

const ClaimRetroactivePoolWizard = props => {
  return <Wizard>
    <ClaimRetroactivePoolWizardStepManager {...props} />
  </Wizard>
}

const ClaimRetroactivePoolWizardStepManager = props => {
  const { closeWizard } = props
  const { activeStepIndex, previousStep, moveToStep, nextStep } = useWizard()

  return <WizardLayout
    currentWizardStep={activeStepIndex + 1}
    handlePreviousStep={previousStep}
    moveToStep={moveToStep}
    totalWizardSteps={4}
    closeWizard={closeWizard}
  >
    <div className='text-inverse'>
      <StepOne nextStep={nextStep} isActive={activeStepIndex === 0}  key={1} />
      <StepTwo nextStep={nextStep} isActive={activeStepIndex === 1} key={2} />
      <StepThree nextStep={nextStep} isActive={activeStepIndex === 2} key={3} />
      <StepFour nextStep={nextStep} isActive={activeStepIndex === 3} key={4} />
    </div>
  </WizardLayout>
}

const StepOne = (props) => {
  const {nextStep, isActive} = props

  const [checked, setChecked] = useState(false)

  if (!isActive) {
    return null
  }

  return <div className='mx-auto' style={{maxWidth: '550px'}}>
    <WizardBanner>
      <h4 className='mb-4'>Why are you receiving POOL?</h4>
      <p className='text-sm sm:text-lg text-accent-1'>You are receiving the POOL token because you have used the PoolTogether Protocol. All users of the protocol now completely control all decisions. The POOL token has no value and is used for governing. </p>
    </WizardBanner>
    <CheckboxContainer>
      <CheckboxInputGroup
        marginClasses='m-0'
        id='receiving-i-understand'
        name='receiving-i-understand'
        label='I understand why I am receiving tokens'
        title=''
        checked={checked}
        handleClick={() => setChecked(!checked)}
      />
    </CheckboxContainer>
    <Button
      onClick={nextStep}
      textSize='lg'
      className='w-full'
      disabled={!checked}
    >
      Next
    </Button>
  </div>
}

const StepTwo = (props) => {
  const {nextStep, isActive} = props

  const [checked, setChecked] = useState(false)

  if (!isActive) {
    return null
  }

  return <div className='mx-auto' style={{maxWidth: '550px'}}>
    <WizardBanner>
      <h4 className='mb-4'>What do POOL tokens do?</h4>
      <p className='text-sm sm:text-lg text-accent-1'>The POOL token is used to vote on decisions for the protocol. For example, how many winners should a prize pool have? Should a new prize pool be created? Any protocol changes are voted on by the POOL holders.</p>
    </WizardBanner>
    <CheckboxContainer>
      <CheckboxInputGroup
        marginClasses='m-0'
        id='uses-i-understand'
        name='uses-i-understand'
        label='I understand what tokens do'
        title=''
        checked={checked}
        handleClick={() => setChecked(!checked)}
      />
    </CheckboxContainer>
    <Button
      onClick={nextStep}
      textSize='lg'
      className='w-full'
      disabled={!checked}
    >
      Next
    </Button>
  </div>
}
const StepThree = (props) => {
  const {nextStep, isActive} = props

  // TODO: onClick -> start transaction
  // On completion -> move to next step

  if (!isActive) {
    return null
  }

  return <div className='mx-auto' style={{maxWidth: '550px'}}>
    <h3>You are receiving</h3>
    <h2 className='text-highlight-1 mb-8'>🎉 1,000 POOL 🎉</h2>
    <Button
      onClick={nextStep}
      textSize='lg'
      className='w-full'
    >
      Claim My Tokens
    </Button>
  </div>
}
const StepFour = (props) => {
  const {nextStep, isActive} = props

  if (!isActive) {
    return null
  }

  return <div className='mx-auto' style={{maxWidth: '550px'}}>
    <h3>🎉 🎉 🎉</h3>
    <h3>Successfully Claimed!!</h3>
    <h2 className='text-highlight-1 mb-8'>1,000 POOL</h2>
    <WizardBanner>
      <h4 className='mb-4'>Now let's use these tokens!</h4>
      <p className='text-sm sm:text-lg text-accent-1 mb-4 sm:mb-8'>It can be used to do things and stuff. These things are very cool. They will let you make decisions about the stuff.</p>
      <div className='flex flex-row'>
        <ProposalButton/>
        <LearnMoreButton/>
      </div>
    </WizardBanner>
    
  </div>
}

const WizardBanner = (props) => <Banner className='mx-auto mb-4 sm:mb-12'>{props.children}</Banner>

const CheckboxContainer = (props) => <div style={{maxWidth: '477px'}} className='mx-auto mb-4 sm:mb-12 px-4 py-2 sm:px-8 sm:py-4 bg-orange-darkened text-inverse border-orange border-dashed border-2 rounded-lg font-bold'>{props.children}</div>

const ProposalButton = props => {
  const { onClick, children } = props

  return <Link href='/vote' >
    <a href='/vote' className='p-8 mr-4 bg-card w-full flex flex-col rounded-lg'>
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
        <path d="M16.994 10.3965C16.9924 10.3869 16.9903 10.3776 16.988 10.3682C16.9854 10.3575 16.9847 10.3466 16.9811 10.3361L15.101 4.78371C15.0514 4.63717 14.9176 4.53904 14.7675 4.53904H11.3679L8.04561 1.1069C7.90755 0.964407 7.68401 0.964288 7.54595 1.10702L4.89902 3.84348C4.83275 3.91199 4.79547 4.00488 4.79547 4.10182C4.79547 4.19876 4.83275 4.29165 4.89902 4.36016L5.07221 4.53904H3.23034C3.08009 4.53904 2.94629 4.63729 2.8967 4.78394L1.01979 10.3363C1.01752 10.343 1.0173 10.3501 1.01543 10.3569C1.011 10.3727 1.00746 10.3887 1.00512 10.4054C1.00364 10.4161 1.00256 10.4267 1.002 10.4375C1.00163 10.4445 1 10.451 1 10.458V19.6346C1 19.8365 1.15819 20 1.35343 20H16.6466C16.8418 20 17 19.8365 17 19.6346V10.458C17 10.4539 16.999 10.4502 16.9988 10.4461C16.9984 10.4295 16.9967 10.4131 16.994 10.3965ZM7.79595 1.88191L11.4957 5.70383L9.93702 7.31523H8.76018L5.64879 4.10182L7.79595 1.88191ZM3.48126 5.26981H5.77914L7.75993 7.31523H6.71461C6.51937 7.31523 6.36118 7.47878 6.36118 7.68062C6.36118 7.88246 6.51937 8.04601 6.71461 8.04601H8.61395H10.0834H11.2864C11.4817 8.04601 11.6399 7.88246 11.6399 7.68062C11.6399 7.47878 11.4817 7.31523 11.2864 7.31523H10.9366L12.2454 5.96217C12.3834 5.81956 12.3834 5.58822 12.2454 5.44549L12.0756 5.26981H14.5168L16.1494 10.0914H1.85136L3.48126 5.26981ZM16.2931 19.2692H1.70686V10.8234H16.2931V19.2692V19.2692Z" strokeWidth="0.5" />
      </svg>
      <h4>Vote</h4>
    </a>
  </Link>
}

const LearnMoreButton = props => {
  const { onClick, children } = props

  return <Link href='/vote' >
    <a href='/vote' className='p-8 ml-4 bg-card w-full flex flex-col rounded-lg'>
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
        <path d="M16.994 10.3965C16.9924 10.3869 16.9903 10.3776 16.988 10.3682C16.9854 10.3575 16.9847 10.3466 16.9811 10.3361L15.101 4.78371C15.0514 4.63717 14.9176 4.53904 14.7675 4.53904H11.3679L8.04561 1.1069C7.90755 0.964407 7.68401 0.964288 7.54595 1.10702L4.89902 3.84348C4.83275 3.91199 4.79547 4.00488 4.79547 4.10182C4.79547 4.19876 4.83275 4.29165 4.89902 4.36016L5.07221 4.53904H3.23034C3.08009 4.53904 2.94629 4.63729 2.8967 4.78394L1.01979 10.3363C1.01752 10.343 1.0173 10.3501 1.01543 10.3569C1.011 10.3727 1.00746 10.3887 1.00512 10.4054C1.00364 10.4161 1.00256 10.4267 1.002 10.4375C1.00163 10.4445 1 10.451 1 10.458V19.6346C1 19.8365 1.15819 20 1.35343 20H16.6466C16.8418 20 17 19.8365 17 19.6346V10.458C17 10.4539 16.999 10.4502 16.9988 10.4461C16.9984 10.4295 16.9967 10.4131 16.994 10.3965ZM7.79595 1.88191L11.4957 5.70383L9.93702 7.31523H8.76018L5.64879 4.10182L7.79595 1.88191ZM3.48126 5.26981H5.77914L7.75993 7.31523H6.71461C6.51937 7.31523 6.36118 7.47878 6.36118 7.68062C6.36118 7.88246 6.51937 8.04601 6.71461 8.04601H8.61395H10.0834H11.2864C11.4817 8.04601 11.6399 7.88246 11.6399 7.68062C11.6399 7.47878 11.4817 7.31523 11.2864 7.31523H10.9366L12.2454 5.96217C12.3834 5.81956 12.3834 5.58822 12.2454 5.44549L12.0756 5.26981H14.5168L16.1494 10.0914H1.85136L3.48126 5.26981ZM16.2931 19.2692H1.70686V10.8234H16.2931V19.2692V19.2692Z" strokeWidth="0.5" />
      </svg>
      <h4>Learn More</h4>
    </a>
  </Link>
}