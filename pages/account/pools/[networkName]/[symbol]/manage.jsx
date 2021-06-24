import React from 'react'

import { ManageUI } from 'lib/components/ManageUI'
import Layout from 'lib/components/Layout'

function ManagePool(props) {
  return (
    <Layout>
      <ManageUI {...props} />
    </Layout>
  )
}

export default ManagePool
