import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import CopyToClipboard from 'react-copy-to-clipboard'

import { useTranslation } from 'lib/../i18n'
import { poolToast } from 'lib/utils/poolToast'

export const CopyIcon = (props) => {
  const { t } = useTranslation()
  const { text, className } = props

  const handleCopy = () => {
    poolToast.success(t('copiedToClipboard'))
  }

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <FeatherIcon
        icon='copy'
        className={classnames(
          'em-1 my-auto inline-block trans cursor-pointer hover:opacity-70',
          className
        )}
      />
    </CopyToClipboard>
  )
}
