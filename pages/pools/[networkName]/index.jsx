import React from 'react'

import { IndexUI } from 'lib/components/IndexUI'

const PoolsByNetworkPage = (props) => {
  return <IndexUI {...props} />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export default PoolsByNetworkPage
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
