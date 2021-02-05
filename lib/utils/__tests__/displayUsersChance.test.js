import { ethers } from 'ethers'

import { displayUsersChance } from '../displayUsersChance'

const bn = ethers.utils.bigNumberify

describe('displayUsersChance', () => {
  it('works as expected', () => {
    const total = bn(1234)
    const userBalance = bn(68)
    const t = jest.fn()

    expect(displayUsersChance(total, userBalance, t)).toEqual('18.14')
  })

  it('works with giant numbers', () => {
    const total = bn('123490394832947298478972394')
    const userBalance = bn('68248287093489032848234')
    const t = jest.fn()

    expect(displayUsersChance(total, userBalance, t)).toEqual('1,809')
  })
})
