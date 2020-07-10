import { queryParamUpdater } from '../queryParamUpdater'

describe('queryParamUpdater', () => {

  it('updates a path that has no query', () => {
    const router = {
      pathname: '/[var]',
      asPath: '/asdf',
      push: jest.fn()
    }

    queryParamUpdater.add(router, { method: 'crypto' })

    expect(router.push).toHaveBeenCalledWith(
      "/[var]?method=crypto",
      "/asdf?method=crypto",
      { "shallow": true }
    )
  })

  it('updates a path that already has query params', () => {
    const router = {
      pathname: '/[var]?blanko=nino',
      asPath: '/asdf?blanko=nino',
      query: { blanko: 'nino' },
      push: jest.fn()
    }
    
    queryParamUpdater.add(router, { method: 'crypto' })

    expect(router.push).toHaveBeenCalledWith(
      "/[var]?blanko=nino&method=crypto",
      "/asdf?blanko=nino&method=crypto",
      { "shallow": true }
    )
  })

})
