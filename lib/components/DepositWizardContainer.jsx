import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Wizard, WizardStep } from 'react-wizard-primitive'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ExecuteCryptoDeposit } from 'lib/components/ExecuteCryptoDeposit'
import { ConfirmFiatDeposit } from 'lib/components/ConfirmFiatDeposit'
import { DepositCryptoForm } from 'lib/components/DepositCryptoForm'
import { DepositFiatForm } from 'lib/components/DepositFiatForm'
import { DepositWizardSignIn } from 'lib/components/DepositWizardSignIn'
import { WizardSwitchNetwork } from 'lib/components/WizardSwitchNetwork'
import { OrderComplete } from 'lib/components/OrderComplete'
import { PoolNumber } from 'lib/components/PoolNumber'
import { DepositTicketQuantityForm } from 'lib/components/DepositTicketQuantityForm'
import { WizardLayout } from 'lib/components/WizardLayout'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useWalletChainId } from 'lib/hooks/chainId/useWalletChainId'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

import WalletIcon from 'assets/images/icon-wallet.svg'

const NETWORK_SWITCH_STEP_INDEX = 1

export function DepositWizardContainer() {
  const { t } = useTranslation()
  const router = useRouter()

  const method = router.query.method
  const quantity = router.query.quantity

  let initialStepIndex = 0
  if (quantity) {
    initialStepIndex = 1
  }
  if (method) {
    initialStepIndex = 3
  }

  const { usersAddress } = useContext(AuthControllerContext)
  const { data: pool, isFetched: poolIsFetched } = useCurrentPool()

  const walletChainId = useWalletChainId()
  const poolChainId = pool?.chainId
  const networkMismatch = walletChainId !== poolChainId

  if (!poolIsFetched) {
    return null
  }

  const tickerUpcased = pool.tokens.underlyingToken.symbol

  return (
    <>
      <Wizard initialStepIndex={initialStepIndex}>
        {(wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          const back = (e) => {
            if (method) {
              queryParamUpdater.remove(router, 'method')
            } else if (quantity) {
              queryParamUpdater.remove(router, 'quantity')
            }

            previousStep()
          }

          useEffect(() => {
            if (activeStepIndex > NETWORK_SWITCH_STEP_INDEX && pool.chainId !== walletChainId) {
              moveToStep(NETWORK_SWITCH_STEP_INDEX)
            }
          }, [activeStepIndex, walletChainId, pool.chainId])

          return (
            <WizardLayout
              currentWizardStep={activeStepIndex + 1}
              handlePreviousStep={back}
              moveToStep={moveToStep}
              totalWizardSteps={5}
            >
              <WizardStep>
                {(step) => {
                  return (
                    step.isActive && (
                      <DepositTicketQuantityForm
                        iconSrc={WalletIcon}
                        formSubName={
                          <Trans
                            i18nKey='amountTickerEqualsAmountTickets'
                            defaults='<number>{{amount}}</number> {{ticker}} = <number>{{amount}}</number> ticket'
                            components={{
                              number: <PoolNumber />
                            }}
                            values={{
                              amount: '1',
                              ticker: tickerUpcased
                            }}
                          />
                        }
                        nextStep={step.nextStep}
                      />
                    )
                  )
                }}
              </WizardStep>

              {!usersAddress && (
                <WizardStep>
                  {(step) => {
                    return step.isActive && <DepositWizardSignIn tickerUpcased={tickerUpcased} />
                  }}
                </WizardStep>
              )}

              <WizardStep>
                {(step) => {
                  return (
                    step.isActive && (
                      <WizardSwitchNetwork
                        pool={pool}
                        quantity={quantity}
                        nextStep={step.nextStep}
                        networkMismatch={networkMismatch}
                        paneTitleLocizeKey={'depositTicker'}
                        bannerLabel={t('yourDeposit')}
                      />
                    )
                  )
                }}
              </WizardStep>

              <WizardStep>
                {(step) => {
                  return (
                    step.isActive && (
                      <>
                        {method === 'fiat' ? (
                          <DepositFiatForm nextStep={step.nextStep} />
                        ) : (
                          <DepositCryptoForm
                            nextStep={step.nextStep}
                            previousStep={step.previousStep}
                          />
                        )}
                      </>
                    )
                  )
                }}
              </WizardStep>
              <WizardStep>
                {(step) => {
                  return (
                    step.isActive && (
                      <>
                        {method === 'fiat' ? (
                          <ConfirmFiatDeposit nextStep={step.nextStep} />
                        ) : (
                          <ExecuteCryptoDeposit
                            nextStep={step.nextStep}
                            previousStep={step.previousStep}
                          />
                        )}
                      </>
                    )
                  )
                }}
              </WizardStep>
              <WizardStep>
                {(step) => {
                  return (
                    step.isActive && (
                      <>
                        <OrderComplete />
                      </>
                    )
                  )
                }}
              </WizardStep>
            </WizardLayout>
          )
        }}
      </Wizard>
    </>
  )
}
