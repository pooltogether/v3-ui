import React from 'react'

import { Index } from 'lib/components/Pods/Index'
import Layout from 'lib/components/Layout'

const PoolsIndexPage = (props) => {
  return (
    <Layout>
      <Index {...props} />
    </Layout>
  )
}

export default PoolsIndexPage
