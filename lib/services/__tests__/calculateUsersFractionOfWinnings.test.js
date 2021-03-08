import { ethers } from 'ethers'
import { calculateUsersFractionOfWinnings } from '../calculateUsersFractionOfWinnings'

describe('calculateUsersFractionOfWinnings', () => {
  const queries = {
    podUserQuery: {
      balanceUnderlying: ethers.BigNumber.from('38000000000000000000'),
      pendingDeposit: ethers.BigNumber.from('830000000000000000000')
    },
    podPoolUserQuery: {
      committedBalanceOf: ethers.BigNumber.from('20000000000000000000000'),
      openBalanceOf: ethers.BigNumber.from('10000000000000000000000')
    }
  }

  it('calculates and returns the users podShare fraction', () => {
    const result = calculateUsersFractionOfWinnings(
      '0',
      18,
      ethers.BigNumber.from('500000000000000000000'),
      queries.podUserQuery,
      queries.podPoolUserQuery
    )

    expect(result.toString()).toEqual('14466666500000000000')
  })

  it('takes an additional amount into account (ie. if buying more tickets)', () => {
    const result = calculateUsersFractionOfWinnings(
      '2000',
      18,
      ethers.BigNumber.from('500000000000000000000'),
      queries.podUserQuery,
      queries.podPoolUserQuery
    )

    expect(result.toString()).toEqual('44812500000000000000')
  })
})
