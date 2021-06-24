import React from 'react'

import { AccountLoggedIn } from 'lib/components/AccountLoggedIn'
import { AccountUI } from 'lib/components/AccountUI'
import Layout from 'lib/components/Layout'

export default function AccountManage(props) {
  return (
    <Layout>
      <AccountLoggedIn>
        <AccountUI />
      </AccountLoggedIn>
    </Layout>
  )
}
