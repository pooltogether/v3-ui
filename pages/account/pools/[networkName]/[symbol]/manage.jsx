import React from 'react'

import { ManageUI } from 'lib/components/ManageUI'

function ManagePool(props) {
  return <ManageUI {...props} />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}

export default ManagePool
