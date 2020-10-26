import { ethers } from 'ethers'

import { calculateEstimatedPoolPrize } from '../calculateEstimatedPoolPrize'

const bn = ethers.utils.bigNumberify

describe('calculateEstimatedPoolPrize', () => {

  it('returns 0 if loading data', () => {
    const result = calculateEstimatedPoolPrize({
      underlyingCollateralDecimals: undefined,
      awardBalance: undefined,
      ticketSupply: undefined,
      sponsorshipSupply: undefined,
      supplyRatePerBlock: undefined,
      prizePeriodRemainingSeconds: undefined,
    })

    expect(
      result.toString()
    ).toEqual('0')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    const ticket = {
      totalSupply: ethers.utils.parseEther('4000000')
    }
    const sponsorship = {
      totalSupply: ethers.utils.parseEther('1000000')
    }

    const result = calculateEstimatedPoolPrize({
      ticket,
      sponsorship,
      awardBalance: ethers.utils.parseEther('200'),
      supplyRatePerBlock: bn('123456701'),
      prizePeriodRemainingSeconds: bn('3600'),
    })

    expect(
      result.toString()
    ).toEqual('200158641860785000000')
  })


  // TODO: this needs work if we ever bring back non-18 decimal pools
  xit('returns the correct estimate for a 6 decimal precision set of contracts', () => {
    const ticket = {
      totalSupply: ethers.utils.bigNumberify('6000000')
    }
    const sponsorship = {
      totalSupply: ethers.utils.bigNumberify('3000000')
    }
    const underlyingCollateralDecimals = '6'

    const result = calculateEstimatedPoolPrize({
      ticket,
      sponsorship,
      underlyingCollateralDecimals,
      awardBalance: ethers.utils.bigNumberify('4000000'),
      supplyRatePerBlock: bn('170123'),
      prizePeriodRemainingSeconds: bn('500'),
    })

    expect(
      result.toString()
    ).toEqual('403888886')
  })

})
