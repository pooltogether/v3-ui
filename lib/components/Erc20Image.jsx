import React from 'react'
import classnames from 'classnames'

import { TOKEN_IMAGES } from 'lib/constants/tokenImages'
import { useCoingeckoTokenInfoQuery } from 'lib/hooks/useCoingeckoTokenInfoQuery'

export const Erc20Image = (props) => {
  let src = TOKEN_IMAGES[props.address]

  if (!src) {
    const { data: tokenInfo } = useCoingeckoTokenInfoQuery(props.address)
    src = tokenInfo?.image?.thumb
  }

  return src ? (
    <img
      src={src}
      className={classnames(
        'inline-block mr-2 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full',
        props.className
      )}
    />
  ) : (
    <div
      className={classnames(
        'inline-block mr-2 bg-overlay-white w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full',
        props.className
      )}
      style={{
        minWidth: 12
      }}
    />
  )
}
