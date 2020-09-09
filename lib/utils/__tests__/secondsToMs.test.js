import { ethers } from 'ethers'
import { secondsToMs } from '../secondsToMs'

describe('secondsToMs', () => {
  it('works with strings', () => {
    expect(secondsToMs('1')).toEqual(ethers.utils.bigNumberify(1000))
  })

  it('works with numbers', () => {
    throw new Error
    expect(secondsToMs(1)).toEqual(ethers.utils.bigNumberify(1000))
  })

  it('works with big numbers', () => {
    expect(secondsToMs(ethers.utils.bigNumberify(1))).toEqual(ethers.utils.bigNumberify(1000))
  })

  it('ignores dates', () => {
    const date = new Date()
    expect(secondsToMs(date)).toEqual(date)
  })
})
