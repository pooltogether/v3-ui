import React, { useEffect, useRef, useState } from 'react'
import { isSafari } from 'react-device-detect'

import { useTranslation } from 'lib/../i18n'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
// import { Button } from 'lib/components/Button'
// import { PTDropdown } from 'lib/components/PTDropdown'

import GooglePay from 'assets/images/googlepay.svg'
import ApplePay from 'assets/images/applepay.svg'

const wyreDomain = () => {
  return process.env.NEXT_JS_WYRE_PRODUCTION_ACCOUNT_ID ?
    'sendwyre' :
    'testwyre'
}

export const WyreTopUpBalanceDropdown = (props) => {
  const { tickerUpcased } = props
  
  const { t } = useTranslation()

  const dropdownRef = useRef()
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

  if (canBuy === null) {
    console.log("null")
    return null
  }

  const onValueSet = (currency) => {
    handleOpenWyre(currency)
  }

  const googleApplePay = <>
    <img
      src={GooglePay}
      className='inline-block relative h-8 w-16'
      style={{ top: 0 }}
    />{isSafari && <> or <img
      src={ApplePay}
      className='inline-block relative h-8 w-16'
      style={{ top: 0 }}
    /></>}
  </>

  const currencies = {
    [tickerUpcased]: {
      'label': <span className='text-xl sm:text-2xl'>
        Get {tickerUpcased} with {googleApplePay}
      </span>,
    },
    'ETH': {
      'label': <span className='text-xl sm:text-2xl'>
        Get ETH with {googleApplePay}
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
    <div className='relative z-50 mb-3'>
      {!canBuy ?
        <>You will need to acquire ETH &amp; DAI on Coinbase, Kraken, or through MoonPay or Wyre, etc.</>
        : <>
          <DropdownInputGroup
            id='topup-dropdown'
            className='mt-4 mb-20 px-10 py-2 text-sm sm:text-xl lg:text-2xl rounded-lg border-highlight-2 border-2 bg-default text-highlight-2 hover:border-highlight-1 hover:bg-body hover:text-highlight-1'
            label={'Top up my balance'}
            formatValue={formatValue}
            onValueSet={onValueSet}
            current={null}
            values={currencies}
          />
        </>
      }
    </div>
  </>
}
