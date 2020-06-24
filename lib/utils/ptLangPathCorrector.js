import { format as formatUrl, parse as parseUrl } from 'url'

// Many util methods copied here form next-18next as it doesn't
// export those util methods (sadface)

const subpathIsPresent = (url, subpath) => {
  if (typeof url !== 'string' || typeof subpath !== 'string') {
    return false
  }

  const { pathname } = parseUrl(url)

  return typeof pathname === 'string' && (
    (pathname.length === subpath.length + 1 && pathname === `/${subpath}`) ||
    (pathname.startsWith(`/${subpath}/`))
  )
}

const removeSubpath = (url, subpath) => {
  return url.replace(subpath, '').replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

const parseAs = (originalAs, href) => {
  const asType = typeof originalAs
  let as

  if (asType === 'undefined') {
    as = formatUrl(href, {
      unicode: true
    })
  } else if (asType === 'string') {
    as = originalAs
  } else {
    throw new Error(`'as' type must be 'string', but it is ${asType}`)
  }

  return as
}

const parseHref = originalHref => {
  const hrefType = typeof originalHref
  let href

  if (hrefType === 'string') {
    href = parseUrl(originalHref, true
      /* parseQueryString */
    )
  } else if (hrefType === 'object') {
    href = {
      ...originalHref
    }
    href.query = originalHref.query ? {
      ...originalHref.query
    } : {}
  } else {
    throw new Error(`'href' type must be either 'string' or 'object', but it is ${hrefType}`)
  }

  return href
}

export function ptLangPathCorrector(originalAs, originalHref, language, allLanguages) {
  let href = parseHref(originalHref)
  let as = parseAs(originalAs, href)

  /*
    url.format prefers the 'url.search' string over
    the 'url.query' object, so remove the search
    string to ensure the query object is used.
  */
  delete href.search

  /*
    Strip any/all subpaths from the `as` value
  */
  Object.values(allLanguages).forEach(subpath => {
    if (subpathIsPresent(as, subpath)) {
      as = removeSubpath(as, subpath)
    }
  })

  const basePath = `${href.protocol}//${href.host}`
  const currentAs = as.replace(basePath, '')
  const subpath = language

  as = `/${subpath}${currentAs}`.replace(/\/$/, '')

  if (href && href.pathname && !href.pathname.includes(`[lang]`)) {
    href.pathname = `/[lang]${href.pathname}`
  }

  if (href && !href.pathname) {
    console.log(href)
    console.log('hey href! why no pathname?')
  }

  href.path = href.pathname
  href.href = href.pathname

  href.query.lang = language

  return {
    as,
    href
  }
}
