import Cookies from 'js-cookie'
import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'

export const handleCloseWizard = (router) => {
  const pathname = Cookies.get(WIZARD_REFERRER_HREF) || '/pools'
  const asPath = Cookies.get(WIZARD_REFERRER_AS_PATH) || '/pools'

  Cookies.remove(WIZARD_REFERRER_HREF, COOKIE_OPTIONS)
  Cookies.remove(WIZARD_REFERRER_AS_PATH, COOKIE_OPTIONS)

  router.push(`${pathname}`, `${asPath}`, {
    shallow: true
  })
}
