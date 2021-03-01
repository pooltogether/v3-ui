import React from 'react'
import { ethers } from 'ethers'

import { Banner } from 'lib/components/Banner'
import { Trans } from 'lib/../i18n'

import Bell from 'assets/images/bell-red@2x.png'

export const DepositExpectationsWarning = (props) => {
  const { exitFees, decimals, quantity } = props
  const { exitFee, timelockDurationSeconds } = exitFees
  console.log(exitFees)

  console.log(timelockDurationSeconds)
  console.log(ethers.utils.parseUnits(quantity, decimals))
  console.log(ethers.utils.parseUnits(quantity, decimals).toString())

  const days = 3
  const percent = 2
  // const days = timelockDurationSeconds.div('99')
  // const percent = ethers.utils.parseUnits(quantity, decimals).div(exitFee)

  return (
    <Banner
      gradient={null}
      className='bg-primary mt-4 sm:mt-12 mx-auto w-full'
      style={{ maxWidth: 380 }}
    >
      <img className='mx-auto mb-3 h-8' src={Bell} />

      <span className='sm:leading-tight sm:ml-2'>
        <Trans
          i18nKey='youCanWithdrawWithNoPenaltyDescription'
          defaults='You can withdraw with no penalty {{days}} days after depositing. Funds withdrawn earlier are subjected to up to a {{percent}}% early exit fee. <a>Learn more</a>'
          components={{
            a: <a
              className='underline'
              href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
              target='_blank'
            />
          }}
          values={{
            days,
            percent
          }}
        />
      </span>
    </Banner>
  )
}
