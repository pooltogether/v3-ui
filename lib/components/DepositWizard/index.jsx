import React, { useEffect, useState } from 'react'
import Wizard, { useWizard } from 'react-wizard-primitive'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'

import { WizardLayout } from 'lib/components/WizardLayout'
import { DepositReceipt } from 'lib/components/DepositWizard/DepositReceipt'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useTransaction } from 'lib/hooks/useTransaction'

// 1. Deposit amount
// 2. Wallet connect > Network connect > Approval > Review & Submit
// 3. Success

export const DepositWizard = (props) => {
  const { contractAddress, tokenAddress, chainId, isFetched } = props

  const {
    DepositAmount,
    DepositAmountProps,
    ReviewAndSubmitDeposit,
    ReviewAndSubmitDepositProps,
    DepositReceipt,
    DepositReceiptProps
  } = props

  const router = useRouter()
  const { quantity, prevTicketBalance, prevUnderlyingBalance } = router.query

  const { network: walletChainId, address: usersAddress } = useOnboard()

  const [isUserOnCorrectNetwork, setIsUserOnCorrectNetwork] = useState(walletChainId === chainId)

  const [approveTxId, setApproveTxId] = useState(0)
  const [depositTxId, setDepositTxId] = useState(0)

  const approveTx = useTransaction(approveTxId)
  const depositTx = useTransaction(depositTxId)

  const { activeStepIndex, previousStep, moveToStep, nextStep } = useWizard({
    initialStepIndex: 0
  })

  useEffect(() => {
    setIsUserOnCorrectNetwork(walletChainId === chainId)
  }, [walletChainId, chainId])

  const form = useForm({
    mode: 'all',
    reValidateMode: 'onChange'
  })

  const approveTxPending =
    (approveTx?.inWallet || approveTx?.sent) && !approveTx?.cancelled && !approveTx?.error
  const depositTxPending =
    (depositTx?.inWallet || depositTx?.sent) && !depositTx?.cancelled && !depositTx?.error
  const showPreviousButton = activeStepIndex !== 2 && !approveTxPending && !depositTxPending

  if (!isFetched) {
    return (
      <Wizard>
        <WizardLayout
          activeStepIndex={activeStepIndex}
          initialStepIndex={0}
          currentWizardStep={activeStepIndex}
          handlePreviousStep={previousStep}
          moveToStep={moveToStep}
          totalWizardSteps={3}
          showPreviousButton={showPreviousButton}
        >
          <V3LoadingDots className='mx-auto' />
        </WizardLayout>
      </Wizard>
    )
  }

  return (
    <Wizard>
      <WizardLayout
        activeStepIndex={activeStepIndex}
        initialStepIndex={0}
        currentWizardStep={activeStepIndex}
        handlePreviousStep={previousStep}
        moveToStep={moveToStep}
        totalWizardSteps={3}
        showPreviousButton={showPreviousButton}
      >
        {activeStepIndex === 0 && (
          <DepositAmount
            {...DepositAmountProps}
            nextStep={nextStep}
            key={0}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            quantity={quantity}
            prevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
            chainId={chainId}
            form={form}
          />
        )}
        {activeStepIndex === 1 && (
          <ReviewAndSubmitDeposit
            {...ReviewAndSubmitDepositProps}
            nextStep={nextStep}
            previousStep={previousStep}
            key={1}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            chainId={chainId}
            isUserOnCorrectNetwork={isUserOnCorrectNetwork}
            quantity={quantity}
            aprevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
            pproveTxId={approveTxId}
            setApproveTxId={setApproveTxId}
            depositTxId={depositTxId}
            setDepositTxId={setDepositTxId}
          />
        )}
        {activeStepIndex === 2 && (
          <DepositReceipt
            {...DepositReceiptProps}
            nextStep={nextStep}
            key={2}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            quantity={quantity}
            prevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
            chainId={chainId}
            form={form}
          />
        )}
      </WizardLayout>
    </Wizard>
  )
}

DepositWizard.defaultProps = {
  DepositReceipt: DepositReceipt,
  DepositAmountProps: {},
  ReviewAndSubmitDepositProps: {},
  DepositReceiptProps: {}
}
