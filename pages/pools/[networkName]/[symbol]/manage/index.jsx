import { ManageUI } from 'lib/components/ManageUI'
import React from 'react'

export default function ManagePool(props) {
  return <ManageUI {...props} />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}
