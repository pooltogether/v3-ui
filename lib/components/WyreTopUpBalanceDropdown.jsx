import React from 'react'
import { isSafari } from 'react-device-detect'
import { poolToast } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'
import { axiosInstance } from 'lib/axiosInstance'
import { DropdownList } from 'lib/components/DropdownList'

// import GooglePay from 'assets/images/googlepay.svg'
import ApplePay from 'assets/images/applepay.svg'

const WYRE_LAMBDA_PATH = `/.netlify/functions/wyre-api`

export function WyreTopUpBalanceDropdown(props) {
  const { t } = useTranslation()

  const { label, className, hoverTextColor, textColor, tickerUpcased } = props

  const onValueSet = (currency) => {
    handleOpenWyre(currency)
  }

  const applePay = (
    <>
      {isSafari && (
        <>
          , <img src={ApplePay} className='inline-block relative h-6 w-12' style={{ top: 0 }} />
        </>
      )}
    </>
  )

  const currencies = {
    [tickerUpcased]: {
      label: (
        <span className='text-xs'>
          {t('buyTickerDebitCreditCard', {
            ticker: tickerUpcased
          })}
          {applePay}
        </span>
      )
    },
    ETH: {
      label: (
        <span className='text-xs'>
          {t('buyEthDebitCreditCard')}
          {applePay}
        </span>
      )
    }
  }

  const handleOpenWyre = async (currency) => {
    const { usersAddress } = props

    const params = {
      path: `/v3/orders/reserve`,
      dest: `ethereum:${usersAddress}`,
      destCurrency: currency.toUpperCase()
    }

    let response

    try {
      response = await axiosInstance.post(`${WYRE_LAMBDA_PATH}`, params)

      // dropdownRef.handleClose()

      const url = response?.data?.url

      if (url) {
        window.open(url)
      } else {
        console.warn(response.error)
      }
    } catch (e) {
      poolToast.error(`Wyre - purchase error, please try again or message support`)
      console.error(e)
    }
  }

  const formatValue = (key) => {
    const currency = currencies[key]

    return <>{currency.label}</>
  }

  return (
    <>
      <span className='relative z-50'>
        <DropdownList
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
      </span>
    </>
  )
}
