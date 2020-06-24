import { configureScope, captureException } from '@sentry/browser'

import { getWeb3ProviderName } from 'lib/utils/getWeb3ProviderName'
import { getSystemInfo } from 'lib/utils/getSystemInfo'

const debug = require('debug')('pt:utils:reportToSentry')

export const reportToSentry = async (error, context = {}) => {
  const systemInfo = await getSystemInfo()
  const web3ProviderName = getWeb3ProviderName(
    window.web3,
    systemInfo.browser
  )

  context.tags = {
    ...context.tags,
    web3ProviderName
  }

  context.extra = {
    ...context.tags,
    web3ProviderName
  }

  let t = {}
  configureScope(function (scope) {
    scope.setTags(context.tags || {})
    scope.setExtras(context.extra || {})
    // fatal, error, warning, info, and debug.
    // error is the default, fatal is the most severe,
    // and debug is the least
    scope.setLevel('warning')
    t = scope
  })

  debug('Sending scope: ', t, ' to Sentry with error: ', error.toString())

  captureException(error)
}
