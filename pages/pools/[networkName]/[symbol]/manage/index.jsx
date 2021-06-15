import Layout from 'lib/components/Layout'
import { ManageUI } from 'lib/components/ManageUI'
import React from 'react'

export default function ManagePool(props) {
  return (
    <Layout>
      <ManageUI {...props} />
    </Layout>
  )
}
