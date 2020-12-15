import { useAccountQuery } from '../useAccountQuery'

describe('useAccountQuery', () => {

  it('santizes the address', () => {
    useAccountQuery('0xFacE')

    const useQueryMock = jest.fn()
    // [1].map(x => mock(x))

    expect(
      'useQuery'
    ).toBeCalledWith()
  })

})
