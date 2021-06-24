import React from 'react'

import Layout from 'lib/components/Layout'
import { ManageUI } from 'lib/components/ManageUI'

export default function ManagePool(props) {
  return (
    <Layout>
      <ManageUI {...props} />
    </Layout>
  )
}
