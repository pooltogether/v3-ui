import React from 'react'
import classnames from 'classnames'

import { TOKEN_IMAGES_BY_ADDRESS } from 'lib/constants/tokenImages'
import { useCoingeckoTokenInfoQuery } from 'lib/hooks/useCoingeckoTokenInfoQuery'

export const Erc20Image = (props) => {
  const sizeClasses = props.sizeClasses ?? 'w-5 h-5'
  const marginClasses = props.marginClasses ?? 'mr-2'

  let src = TOKEN_IMAGES_BY_ADDRESS[props.address.toLowerCase()]

  if (!src) {
    const { data: tokenInfo } = useCoingeckoTokenInfoQuery(props.address)
    src = tokenInfo?.image?.thumb
  }

  return src ? (
    <img
      src={src}
      className={classnames(
        'inline-block rounded-full',
        props.className,
        sizeClasses,
        marginClasses
      )}
    />
  ) : (
    <div
      className={classnames(
        'inline-block rounded-full bg-overlay-white',
        props.className,
        sizeClasses,
        marginClasses
      )}
      style={{
        minWidth: 12
      }}
    />
  )
}
