import React from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PoolCountUp } from 'lib/components/PoolCountUp'

export const Odds = (props) => {
  const { t } = useTranslation()

  const {
    className,
    hide,
    fontSansRegular,
    isWithdraw,
    pool,
    showLabel,
    sayEveryWeek,
    splitLines,
    altSplitLines,
    style,
    timeTravelTotalSupply,
    usersBalance,
  } = props

  let { additionalQuantity } = props

  const font = fontSansRegular ? 'font-sans-regular' : ''

  let content = null

  const hasBalance = !isNaN(usersBalance) && usersBalance > 0

  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals
  const totalSupply = timeTravelTotalSupply || pool?.totalSupply

  let totalSupplyFloat
  if (totalSupply && underlyingCollateralDecimals) {
    totalSupplyFloat = Number(ethers.utils.formatUnits(
      totalSupply,
      Number(underlyingCollateralDecimals)
    ))
  }

  additionalQuantity = isWithdraw ?
    Number(additionalQuantity) * - 1 :
    Number(additionalQuantity)
  const hasAdditionalQuantity = !isNaN(additionalQuantity)
    && additionalQuantity !== 0

  let postPurchaseBalance = usersBalance
  if (hasAdditionalQuantity) {
    postPurchaseBalance = Number(usersBalance) + additionalQuantity
    totalSupplyFloat = totalSupplyFloat + additionalQuantity
  }

  let result = null
  if (postPurchaseBalance < 1) {
    result = 0
  } else {
    result = totalSupplyFloat / postPurchaseBalance
  }
 
  let label = showLabel && <>
    {hasAdditionalQuantity && additionalQuantity !== 0 ? <>
      {!isWithdraw && <span className='font-bold text-flashy'>{t('newOddsOfWinning')}</span>}
      {isWithdraw && t('newOddsOfWinning')}
    </>
       :
      t('currentOddsOfWinning')
    }
  </>

  if (result === 0) {
    label = <>
      {label}
      <br />{t('notAvailableAbbreviation')}
    </>
  } else if (isWithdraw && !isFinite(result)) {
    content = t('withdrawingEverythingMakeYouIneligible')
  } else if (!hide && (hasBalance || hasAdditionalQuantity)) {
    const totalOdds = <PoolCountUp
      fontSansRegular
      start={result}
      end={result}
    />

    content = <>
      {label} {splitLines && <br />}<span
        className={`${font} font-bold`}
      >1</span>

      {altSplitLines ? <>
        <div className='-mt-1 text-xs sm:text-sm'>{t('in')} {totalOdds}</div>
      </> : <>
        &nbsp;{t('in')} {totalOdds}
      </>} {sayEveryWeek && t('everyWeek')}
    </>
  }

  return <div
    style={{
      minHeight: 24
    }}
    className={className}
    style={style}
  >
    {content}
  </div>
}
