import React, { useEffect, useState } from 'react'
import { isSafari } from 'react-device-detect'

import { useTranslation } from 'lib/../i18n'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

// import GooglePay from 'assets/images/googlepay.svg'
import ApplePay from 'assets/images/applepay.svg'

const wyreDomain = () => {
  return process.env.NEXT_JS_WYRE_PRODUCTION_ACCOUNT_ID ?
    'sendwyre' :
    'testwyre'
}

export const WyreTopUpBalanceDropdown = (props) => {
  const {
    label,
    className,
    hoverTextColor,
    textColor,
    showSuggestion,
    tickerUpcased
  } = props
  
  const { t } = useTranslation()

  const [canBuy, setCanBuy] = useState(null)

  const checkIfCanBuy = async () => {
    const url = `https://api.${wyreDomain()}.com/v2/location/widget`

    try {
      const response = await fetch(url)
      const data = await response.json()

      setCanBuy(!data.hasRestrictions)
    } catch (error) {
      console.error('There was an issue in WyreTopUpBalanceDropdown:', error.message)
      setCanBuy(false)
    }
  }

  useEffect(() => {
    checkIfCanBuy()
  }, [])

  const onValueSet = (currency) => {
    handleOpenWyre(currency)
  }

  const applePay = <>
    {isSafari && <>, <img
      src={ApplePay}
      className='inline-block relative h-8 w-16'
      style={{ top: 0 }}
    /></>}
  </>

  const currencies = {
    [tickerUpcased]: {
      'label': <span className='text-lg'>
        Buy {tickerUpcased} (Debit, Credit Card{applePay})
      </span>,
    },
    'ETH': {
      'label': <span className='text-lg'>
        Buy ETH (Debit, Credit Card{applePay})
      </span>,
    },
  }

  const handleOpenWyre = (currency) => {
    const {
      usersAddress
    } = props

    // dropdownRef.handleClose()

    const WYRE_ACCOUNT_ID = process.env.NEXT_JS_WYRE_PRODUCTION_ACCOUNT_ID || process.env.NEXT_JS_WYRE_ACCOUNT_ID

    const dest = `dest=${usersAddress}`
    const destCurrency = `destCurrency=${currency.toUpperCase()}`

    // this gets hard-coded so the user can't adjust the amount :(
    // const sourceAmount = `sourceAmount=${amount}`

    const accountId = `accountId=${WYRE_ACCOUNT_ID}`

    // trackGAEvent('Wyre', currency, 'Opened')

    const url = `https://pay.${wyreDomain()}.com/purchase?${dest}&${destCurrency}&${accountId}`

    // For analytics, etc
    // const redirectUrl = `redirectUrl=${window.location}`
    //&${redirectUrl}
    // window.location.href = url

    window.open(url)
  }

  const formatValue = (key) => {
    const currency = currencies[key]

    return <>
      {currency.label}
    </>
  }

  return <>
    <span className='relative z-50'>
      {canBuy && <>
        <DropdownInputGroup
          id='topup-dropdown'
          label={label}
          className={className}
          textColor={textColor}
          hoverTextColor={hoverTextColor}
          formatValue={formatValue}
          onValueSet={onValueSet}
          current={null}
          values={currencies}
        />
      </>}

      {!canBuy && showSuggestion && <>
        You will need to acquire ETH &amp; DAI on Coinbase, Kraken, or through MoonPay or Wyre, etc.
      </>}
    </span>
  </>
}
