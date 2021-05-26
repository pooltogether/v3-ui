import React from 'react'

import { IndexUI } from 'lib/components/IndexUI'

const IndexPage = (props) => {
  return <IndexUI {...props} />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export default IndexPage
