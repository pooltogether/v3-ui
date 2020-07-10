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

    console.log('pushing onto router:')
    console.log(newPathname);
    console.log(newAsPath);
    console.log('with shallow true');

    router.push(
      newPathname,
      newAsPath,
      { shallow: true }
    )
  },

  remove: (router) => {
    console.warn('not implemented')
  }

}
