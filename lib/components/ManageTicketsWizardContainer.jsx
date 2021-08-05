import React, { useEffect } from 'react'
import { Wizard, WizardStep } from 'react-wizard-primitive'
import { useRouter } from 'next/router'
import { useOnboard } from '@pooltogether/hooks'
import { useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { ConfirmWithdrawWithFeeForm } from 'lib/components/ConfirmWithdrawWithFeeForm'
import { GenericConnectWalletCTA } from 'lib/components/GenericConnectWalletCTA'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Meta } from 'lib/components/Meta'
import { ManageTicketsForm } from 'lib/components/ManageTicketsForm'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { WithdrawInstant } from 'lib/components/WithdrawInstant'
import { WizardSwitchNetwork } from 'lib/components/WizardSwitchNetwork'
import { WizardLayout } from 'lib/components/WizardLayout'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useExitFees } from 'lib/hooks/useExitFees'
import { useMaxTimelockDurationSeconds } from 'lib/hooks/useMaxTimelockDurationSeconds'

const NETWORK_SWITCH_STEP_INDEX = 1

export function ManageTicketsWizardContainer() {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const quantity = router.query.quantity

  let initialStepIndex = 0
  // move the user forward if they're refreshing the page or going straight to a URL with `quantity` in url params
  if (quantity) {
    initialStepIndex = 1
  }

  const { data: pool, isFetched: poolIsFetched } = useCurrentPool()

  const { network: walletChainId } = useOnboard()
  const poolChainId = pool?.chainId
  const networkMismatch = walletChainId !== poolChainId

  if (!poolIsFetched) {
    return null
  }

  return (
    <>
      <Meta title={t('withdraw')} />

      <Wizard initialStepIndex={initialStepIndex}>
        {(wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          const { exitFees } = useExitFees(
            pool.chainId,
            pool.prizePool.address,
            pool.tokens.ticket.address,
            pool.tokens.ticket.decimals,
            quantity
          )

          let notEnoughCredit = null
          if (exitFees && exitFees.exitFee) {
            notEnoughCredit = exitFees.exitFee.gt(0)
          }

          useEffect(() => {
            if (activeStepIndex > NETWORK_SWITCH_STEP_INDEX && pool.chainId !== walletChainId) {
              moveToStep(NETWORK_SWITCH_STEP_INDEX)
            }
          }, [activeStepIndex, walletChainId, pool.chainId])

          return (
            <WizardLayout
              showPreviousButton={false}
              currentWizardStep={activeStepIndex + 1}
              handlePreviousStep={previousStep}
              moveToStep={moveToStep}
              totalWizardSteps={4}
            >
              {!usersAddress && (
                <div
                  className='fixed flex flex-col items-center justify-center left-0 right-0 top-20 w-full z-20'
                  style={{
                    backgroundColor: 'rgba(23, 11, 56, 0.97)',
                    height: '80vh'
                  }}
                >
                  <GenericConnectWalletCTA />
                </div>
              )}

              {activeStepIndex > 1 && notEnoughCredit === null ? (
                <div className='flex flex-col justify-center items-center'>
                  <div className='mb-2'>
                    <ThemedClipSpinner size={32} />
                  </div>
                  <PaneTitle>{t('gettingAvailableCredit')}</PaneTitle>
                </div>
              ) : (
                <>
                  <WizardStep>
                    {(step) => {
                      return step.isActive && <ManageTicketsForm nextStep={step.nextStep} />
                    }}
                  </WizardStep>

                  <WizardStep>
                    {(step) => {
                      return (
                        step.isActive && (
                          <WizardSwitchNetwork
                            pool={pool}
                            quantity={quantity}
                            nextStep={step.nextStep}
                            networkMismatch={networkMismatch}
                            paneTitleLocizeKey={'withdrawTicker'}
                          />
                        )
                      )
                    }}
                  </WizardStep>

                  {notEnoughCredit === false && (
                    <WizardStep>
                      {(step) => {
                        return (
                          step.isActive && (
                            <WithdrawInstant
                              pool={pool}
                              exitFees={exitFees}
                              nextStep={step.nextStep}
                              previousStep={step.previousStep}
                            />
                          )
                        )
                      }}
                    </WizardStep>
                  )}

                  {notEnoughCredit && (
                    <WizardStep>
                      {(step) => {
                        return (
                          step.isActive && (
                            <ConfirmWithdrawWithFeeForm
                              pool={pool}
                              previousStep={step.previousStep}
                              nextStep={step.nextStep}
                              quantity={quantity}
                            />
                          )
                        )
                      }}
                    </WizardStep>
                  )}

                  <WizardStep>
                    {(step) => {
                      return step.isActive && <WithdrawComplete quantity={quantity} />
                    }}
                  </WizardStep>
                </>
              )}
            </WizardLayout>
          )
        }}
      </Wizard>
    </>
  )
}
