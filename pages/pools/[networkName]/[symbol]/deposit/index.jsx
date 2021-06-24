import React from 'react'

import { PoolShow } from 'lib/components/PoolShow'
import Layout from 'lib/components/Layout'

export default function DepositPage(props) {
  return (
    <Layout>
      <PoolShow {...props} />
    </Layout>
  )
}
