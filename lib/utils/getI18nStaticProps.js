import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nexti18nextconfig from 'i18n'

export const getStaticProps = async ({ locale }) => ({
  props: {
    // ...(await serverSideTranslations(locale, ['common']))
  }
})
