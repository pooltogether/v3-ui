import React, { useEffect, useState } from 'react'
import Wizard, { useWizard } from 'react-wizard-primitive'
import { useTransaction } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { WizardLayout } from 'lib/components/WizardLayout'
import { WithdrawReceipt } from 'lib/components/WithdrawWizard/WithdrawReceipt'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

// 1. Deposit amount
// 2. Wallet connect > Network connect > Review & Submit
// 3. Success

export const WithdrawWizard = (props) => {
  const { contractAddress, tokenAddress, chainId, isFetched } = props

  const {
    WithdrawAmount,
    WithdrawAmountProps,
    ReviewAndSubmitWithdraw,
    ReviewAndSubmitWithdrawProps,
    WithdrawReceipt,
    WithdrawReceiptProps
  } = props

  const router = useRouter()
  const { quantity, prevTicketBalance, prevUnderlyingBalance } = router.query

  const { network: walletChainId, address: usersAddress } = useOnboard()

  const [isUserOnCorrectNetwork, setIsUserOnCorrectNetwork] = useState(walletChainId === chainId)

  const [approveTxId, setApproveTxId] = useState(0)
  const [withdrawTxId, setWithdrawTxId] = useState(0)

  const approveTx = useTransaction(approveTxId)
  const withdrawTx = useTransaction(withdrawTxId)

  const { activeStepIndex, previousStep, moveToStep, nextStep } = useWizard({
    initialStepIndex: 0
  })

  const approveTxPending =
    (approveTx?.inWallet || approveTx?.sent) && !approveTx?.cancelled && !approveTx?.error
  const withdrawTxPending =
    (withdrawTx?.inWallet || withdrawTx?.sent) && !withdrawTx?.cancelled && !withdrawTx?.error
  const showPreviousButton = activeStepIndex !== 2 && !approveTxPending && !withdrawTxPending

  useEffect(() => {
    setIsUserOnCorrectNetwork(walletChainId === chainId)
  }, [walletChainId, chainId])

  const form = useForm({
    mode: 'all',
    reValidateMode: 'onChange'
  })

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
          <WithdrawAmount
            {...WithdrawAmountProps}
            nextStep={nextStep}
            key={0}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            chainId={chainId}
            form={form}
            quantity={quantity}
            prevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
          />
        )}
        {activeStepIndex === 1 && (
          <ReviewAndSubmitWithdraw
            {...ReviewAndSubmitWithdrawProps}
            nextStep={nextStep}
            key={1}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            chainId={chainId}
            isUserOnCorrectNetwork={isUserOnCorrectNetwork}
            approveTxId={approveTxId}
            setApproveTxId={setApproveTxId}
            withdrawTxId={withdrawTxId}
            setWithdrawTxId={setWithdrawTxId}
            quantity={quantity}
            prevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
          />
        )}
        {activeStepIndex === 2 && (
          <WithdrawReceipt
            {...WithdrawReceiptProps}
            nextStep={nextStep}
            key={2}
            tokenAddress={tokenAddress}
            contractAddress={contractAddress}
            chainId={chainId}
            form={form}
            quantity={quantity}
            prevTicketBalance={prevTicketBalance}
            prevUnderlyingBalance={prevUnderlyingBalance}
          />
        )}
      </WizardLayout>
    </Wizard>
  )
}

WithdrawWizard.defaultProps = {
  WithdrawReceipt: WithdrawReceipt,
  WithdrawAmountProps: {},
  ReviewAndSubmitWithdrawProps: {},
  WithdrawReceiptProps: {}
}
