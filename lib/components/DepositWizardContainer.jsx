import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { Wizard, WizardStep } from 'react-wizard-primitive'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ExecuteCryptoDeposit } from 'lib/components/ExecuteCryptoDeposit'
import { ConfirmFiatDeposit } from 'lib/components/ConfirmFiatDeposit'
import { DepositCryptoForm } from 'lib/components/DepositCryptoForm'
import { DepositFiatForm } from 'lib/components/DepositFiatForm'
import { DepositWizardSignIn } from 'lib/components/DepositWizardSignIn'
import { FiatOrCryptoForm } from 'lib/components/FiatOrCryptoForm'
import { Meta } from 'lib/components/Meta'
import { OrderComplete } from 'lib/components/OrderComplete'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'
import { WizardLayout } from 'lib/components/WizardLayout'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const DepositWizardContainer = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  
  const method = router.query.method
  const quantity = router.query.quantity

  let initialStepIndex = 0
  if (quantity) {
    initialStepIndex = 1
  }
  if (method) {
    initialStepIndex = 2
  }

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  return <>
    <Meta
      title={`Deposit`}
    />

    <Wizard
      initialStepIndex={initialStepIndex}
    >
      {
        (wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          const back = (e) => {
            if (method) {
              queryParamUpdater.remove(router, 'method')
            } else if (quantity) {
              queryParamUpdater.remove(router, 'quantity')
            }
            
            previousStep()
          } 

          return <WizardLayout
            currentWizardStep={activeStepIndex + 1}
            handlePreviousStep={back}
            moveToStep={moveToStep}
            totalWizardSteps={usersAddress ? 4 : 5}
          >
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <TicketQuantityForm
                    formName={t('getTickets')}
                    formSubName={`1 ticket = 1 ${pool?.underlyingCollateralSymbol}`}
                    nextStep={step.nextStep}
                  />
                </>
              }}
            </WizardStep>
            {/* <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <FiatOrCryptoForm
                    nextStep={step.nextStep}
                  />
                </>
              }}
            </WizardStep> */}
            {!usersAddress && <>
              <WizardStep>
                {(step) => {
                  return step.isActive && <>
                    <DepositWizardSignIn />
                  </>
                }}
              </WizardStep>
            </>}
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  {method === 'fiat' ?
                    <DepositFiatForm
                      nextStep={step.nextStep}
                    /> :
                    <DepositCryptoForm
                      nextStep={step.nextStep}
                      previousStep={step.previousStep}
                    />
                  }
                </>
              }}
            </WizardStep>
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  {method === 'fiat' ?
                    <ConfirmFiatDeposit
                      nextStep={step.nextStep}
                    /> :
                    <ExecuteCryptoDeposit
                      nextStep={step.nextStep}
                      previousStep={step.previousStep}
                    />
                  }
                </>
              }}
            </WizardStep>
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <OrderComplete />
                </>
              }}
            </WizardStep>
          </WizardLayout>
        }
      }
    </Wizard>
  </>
}
