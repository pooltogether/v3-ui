import React, { useState } from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PTHint } from 'lib/components/PTHint'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const InstantOrScheduledForm = (props) => {
  const { pool, exitFees, quantity } = props
  const [withdrawType, setWithdrawType] = useState('scheduled')

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol

  const {
    instantCredit,
    instantFee,
  } = exitFees

  let instantFull = ethers.utils.bigNumberify(0)
  let instantPartial = ethers.utils.bigNumberify(0)
  if (quantity && underlyingCollateralDecimals) {
    instantPartial = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    ).sub(instantFee)

    instantFull = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    )
  }
 
  const instantFullFormatted = displayAmountInEther(
    instantFull,
    { decimals: underlyingCollateralDecimals }
  )
  const instantPartialFormatted = displayAmountInEther(
    instantPartial,
    { decimals: underlyingCollateralDecimals }
  )
  const instantFeeFormatted = displayAmountInEther(
    instantFee,
    { decimals: underlyingCollateralDecimals }
  )

  return <div
    className='text-inverse'
  >
    <PaneTitle>
      Withdraw {quantity} tickets
    </PaneTitle>

    <RadioInputGroup
      label='Choose how to receive your funds:'
      name='withdrawType'
      onChange={handleWithdrawTypeChange}
      value={withdrawType}
      radios={[
        {
          value: 'scheduled',
          label: `I want my full $${instantFullFormatted} ${underlyingCollateralSymbol} back in 4d 22h`
        },
        {
          value: 'instant',
          label: `I want $${instantPartialFormatted} ${underlyingCollateralSymbol} now and will forfeit the interest`
        }
      ]}
    />



    {withdrawType === 'scheduled' ? <>
      <div
        className='flex items-center justify-center py-2 px-4 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-inverse text-match'
        style={{
          minHeight: 70
        }}
      >
        Your ${instantFullFormatted} {underlyingCollateralSymbol} will be scheduled and ready to withdraw in: 4d 22h
      </div>
      <button
        className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl py-2 px-6 outline-none mt-2'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('instant')
        }}
      >
        Need your funds right now?
      </button>
    </> : <>
      <div
        className='flex items-center justify-center py-2 px-4 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-primary text-inverse'
        style={{
          minHeight: 70
        }}
      >


        {/* <PTHint
          label='Fall in love all over again'
          tip='disguise'
        >
          <button>heart</button>
        </PTHint> */}

        <PTHint
          label="Fall in love all over again"
          tip={<>
            To maintain fairness your funds need to contribute interest towards the prize each week. You can:
          <br /><br />1) SCHEDULE: receive ${quantity} DAI once enough interest has been provided to the prize
          <br /><br />2) INSTANT: pay ${displayAmountInEther(
            instantFee,
            { decimals: underlyingCollateralDecimals }
          )} to withdraw right now and forfeit the interest that would go towards the prize
        </>}
        >
          <button>You will receive ${instantPartialFormatted} {underlyingCollateralSymbol} now and {instantFee.eq(0)
            ? <>burn ${displayAmountInEther(instantCredit)} {underlyingCollateralSymbol} from your fairness credit</>
            : <>forfeit {instantFeeFormatted} {underlyingCollateralSymbol} as interest</>
          }</button>
        </PTHint>

      </div>
      <button
        className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl py-2 px-6 outline-none mt-2'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('scheduled')
        }}
      >
          Don't want to forfeit a ${instantFeeFormatted} {underlyingCollateralSymbol} fairness fee?
      </button>
    </>}


    <br /><br />
    <Button
      wide
      size='lg'
    >
      Continue
    </Button>
    
    
{/* 
    {withdrawType === 'instant' && instantFee.eq(0) && <>
      <div className='font-bold mt-8'>
        Why is the fairness fee $0?
      </div>
      <p>
        The fairness fee is based on the previous prize and other factors (see documentation or contract code).
      </p>
    </>} */}

  </div> 
}
