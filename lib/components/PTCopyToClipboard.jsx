import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'lib/../i18n'
import { poolToast } from 'lib/utils/poolToast'

export const PTCopyToClipboard = (props) => {
  const { text, textShort } = props

  const { t } = useTranslation()

  const handleCopy = () => {
    poolToast.success(t('copiedToClipboard'))
  }

  return <>
    <CopyToClipboard
      text={text}
      onCopy={handleCopy}
    >
      <a
        className='flex w-full sm:w-8/12 lg:w-1/2 items-center cursor-pointer stroke-current text-inverse hover:text-white h-8 py-1 xs:mb-2 sm:mb-0 bg-primary hover:bg-highlight-2 rounded-sm trans'
        title='Copy to clipboard'
      >
        <span
          className='px-2 sm:px-6 flex-grow text-xxs xs:text-xs w-16 truncate'
        >{textShort || text}</span>
        <FeatherIcon
          icon='copy'
          className='w-4 h-4 mx-1 sm:mx-6 my-1 justify-self-end'
        />
      </a>
    </CopyToClipboard>
  </>
}
