import React, { useEffect, useState } from 'react'
import { isSafari } from 'react-device-detect'

import { useTranslation } from 'lib/../i18n'
import { axiosInstance } from 'lib/axiosInstance'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { poolToast } from 'lib/utils/poolToast'

// import GooglePay from 'assets/images/googlepay.svg'
import ApplePay from 'assets/images/applepay.svg'

const WYRE_LAMBDA_PATH = `/.netlify/functions/wyre-api`

export function WyreTopUpBalanceDropdown(props) {
  const { t } = useTranslation()

  const {
    label,
    className,
    hoverTextColor,
    textColor,
    showSuggestion,
    tickerUpcased
  } = props
  

  // const [canBuy, setCanBuy] = useState(null)

  // const checkIfCanBuy = async () => {
  //   const url = `${wyrePayUrl()}/v2/location/widget`

  //   try {
  //     const response = await fetch(url)
  //     console.log(url)
  //     const data = await response.json()
  //     console.log(data)

  //     setCanBuy(!data.hasRestrictions)
  //   } catch (error) {
  //     console.error('There was an issue in WyreTopUpBalanceDropdown:', error.message)
  //     setCanBuy(false)
  //   }
  // }

  // useEffect(() => {
  //   checkIfCanBuy()
  // }, [])

  const onValueSet = (currency) => {
    handleOpenWyre(currency)
  }

  const applePay = <>
    {isSafari && <>, <img
      src={ApplePay}
      className='inline-block relative h-6 w-12'
      style={{ top: 0 }}
    /></>}
  </>

  const currencies = {
    [tickerUpcased]: {
      'label': <span className='text-xs'>
        {t('buyTickerDebitCreditCard', {
          ticker: tickerUpcased
        })}{applePay}
      </span>,
    },
    'ETH': {
      'label': <span className='text-xs'>
        {t('buyEthDebitCreditCard')}{applePay}
      </span>,
    },
  }

  const handleOpenWyre = async (currency) => {
    const {
      usersAddress
    } = props


    const params = {
      path: `/v3/orders/reserve`,
      dest: `ethereum:${usersAddress}`,
      destCurrency: currency.toUpperCase()
    }

    const response = await axiosInstance.post(
      `${WYRE_LAMBDA_PATH}`,
      params
    )
    console.log({response})

    // dropdownRef.handleClose()

    const url = response?.data?.url

    if (url) {
      window.open(url)
    } else {
      poolToast.error(`Wyre reservation error`)
    }

    // const WYRE_ACCOUNT_ID = process.env.NEXT_JS_WYRE_PRODUCTION_ACCOUNT_ID || process.env.NEXT_JS_WYRE_ACCOUNT_ID

    // const dest = `dest=${usersAddress}`
    // const destCurrency = `destCurrency=${currency.toUpperCase()}`

    // // this gets hard-coded so the user can't adjust the amount :(
    // // const sourceAmount = `sourceAmount=${amount}`

    // const accountId = `accountId=${WYRE_ACCOUNT_ID}`

    // // trackGAEvent('Wyre', currency, 'Opened')

    // const url = `${wyrePayUrl()}/purchase?${dest}&${destCurrency}&${accountId}`

    // // For analytics, etc
    // // const redirectUrl = `redirectUrl=${window.location}`
    // //&${redirectUrl}
    // // window.location.href = url

    // window.open(url)
  }

  const formatValue = (key) => {
    const currency = currencies[key]

    return <>
      {currency.label}
    </>
  }

  return <>
    <span className='relative z-50'>
      {/* {canBuy && <> */}
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
      {/* </>} */}

      {/* {!canBuy && showSuggestion && <>
        {t('needToAcquireCurrencyFromExchange')}
      </>} */}
    </span>
  </>
}
