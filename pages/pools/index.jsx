import React from 'react'

import { IndexUI } from 'lib/components/IndexUI'

const PoolsIndexPage = (props) => {
  return <IndexUI {...props} />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export default PoolsIndexPage
