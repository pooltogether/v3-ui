import React from 'react'
import classnames from 'classnames'

export const BannerGradient = {
  purplePink: 'purple-pink',
  rainbow: 'rainbow'
}

const BannerUnmemoized = (props) => {
  const { gradient, className, children, style } = props

  const bannerClass = 'p-4 xs:p-6 sm:px-8 lg:p-8 rounded-lg'

  if (gradient === BannerGradient.rainbow) {
    return (
      <div
        className={classnames(bannerClass, 'text-purple', className)}
        style={{
          ...style,
          backgroundImage: 'url("/BackgroundGradient.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {children}
      </div>
    )
  } else if (gradient === BannerGradient.purplePink) {
    return (
      <div className={classnames(bannerClass, 'pool-gradient-1', className)} style={style}>
        {children}
      </div>
    )
  } else {
    return (
      <div className={classnames(bannerClass, '', className)} style={style}>
        {children}
      </div>
    )
  }
}

BannerUnmemoized.defaultProps = {
  gradient: BannerGradient.purplePink
}

export const Banner = React.memo(BannerUnmemoized)
