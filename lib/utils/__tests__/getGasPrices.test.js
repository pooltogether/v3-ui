import { getGasPrices } from '../getGasPrices'
import { axiosInstance } from '../../axiosInstance'

jest.mock('../../axiosInstance', () => {
  return {
    get: jest.fn(path => {
      resp: 'onse'
    })
  }
})

// Did I ever tell you how much I dislike jest mocks?
describe('getGasPrices', () => {
  xit('works', async () => {
    const resp = { data: 'hello' }

    const gasPrices = await getGasPrices()

    expect(
      gasPrices
    ).toEqual('0xabcd')
  })
})
