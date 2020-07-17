const queryString = require('query-string')

export const queryParamUpdater = {
  add: (router, addition) => {
    const pathnameParts = [].concat(router.pathname.split('?'))
    const asPathParts = [].concat(router.asPath.split('?'))

    const hasQueryParams = /\?/.test(router.asPath)


    let newParams = { ...addition }
    if (hasQueryParams) {
      const existing = queryString.parse(`?${asPathParts.pop()}`)

      newParams = {
        ...existing,
        ...addition
      }
    }

    const newPathname = `${pathnameParts.shift()}?${queryString.stringify(newParams)}`
    const newAsPath = `${asPathParts.shift()}?${queryString.stringify(newParams)}`

    router.push(
      newPathname,
      newAsPath,
      { shallow: true }
    )

    return router.asPath.toString()
  },

  removeAll: (router) => {
    const pathnameParts = [].concat(router.pathname.split('?'))
    const asPathParts = [].concat(router.asPath.split('?'))

    const newPathname = pathnameParts.shift()
    const newAsPath = asPathParts.shift()

    router.push(
      newPathname,
      newAsPath,
      { shallow: true }
    )

    return router.asPath.toString()
  },

  remove: (router) => {
    console.warn('not implemented')
  }

}
