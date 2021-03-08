export function translatedPoolName(t, name) {
  if (!name) {
    // console.warn('missing translatedPoolName() name')
    return ''
  }

  let str = name
  if (/Community Pool/.test(name)) {
    // Take 'BOND-0xaE92 Community Pool' and return BOND
    const ticker = name.split('-')[0].split(' ')[0]

    str = t('tickerCommunityPoolName', {
      ticker
    })
  }

  return str
}
