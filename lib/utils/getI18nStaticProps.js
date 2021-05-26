import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nexti18nextconfig from 'next-i18next.config'

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
})
