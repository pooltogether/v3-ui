import React from 'react'

import { Banner } from 'lib/components/Banner'
import { Trans } from 'lib/../i18n'

import Bell from 'assets/images/bell-red@2x.png'

export const DepositExpectationsWarning = (props) => {
  return (
    <Banner
      gradient={null}
      className='bg-functional-red mt-4 sm:mt-8'
      style={{ maxWidth: 380 }}
    >
      <img className='mx-auto mb-3 h-8' src={Bell} />
      
      <span className='text-functional-red sm:leading-tight sm:ml-2'>
        <Trans
          i18nKey='youCanWithdrawWithNoPenaltyDescription'
          defaults='You can withdraw with no penalty 10 days after depositing. Funds withdrawn earlier are subjected to up to a 1% early exit fee. <a>Learn more</a>'
          components={{
            a: <a
              className='underline text-functional-red'
              href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
              target='_blank'
            />
          }}
        />        
      </span>
    </Banner>
  )
}
