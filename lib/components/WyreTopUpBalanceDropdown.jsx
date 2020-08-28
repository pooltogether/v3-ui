import React, { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { PTDropdown } from 'lib/components/PTDropdown'

const wyreDomain = () => {
  return process.env.NEXT_JS_WYRE_PRODUCTION_ACCOUNT_ID ?
    'sendwyre' :
    'testwyre'
}

export const WyreTopUpBalanceDropdown = (props) => {
  const [t] = useTranslation()
  const dropdownRef = useRef()
  const [canBuy, setCanBuy] = useState(null)

  const checkIfCanBuy = async () => {
    const url = `https://api.${wyreDomain()}.com/v2/location/widget`

    try {
      const response = await fetch(url)
      console.log(response)
      // setCanBuy(!response.body.hasRestrictions)
    } catch (error) {
      console.error('There was an issue in WyreTopUpBalanceDropdown:', error.message)
      setCanBuy(false)
    }
  }

  useEffect(() => {
    checkIfCanBuy()
  }, [])

  if (canBuy === null) {
    return null
  }

  return <>
    {/* <Button
              textSize='lg'
              className='mt-2'
            >
              Top up balance
            </Button> */}


    <div className='relative z-50 mb-3'>
      {!canBuy ?
        <>Go get ETH/DAI on Coinbase, Kraken, etc</>
        : <>
          <PTDropdown
            label={'Top up balance'}
            ref={dropdownRef}
          >
            <div
              className='my-2 uppercase text-sm text-purple-400 font-bold h-10 bg-lightPurple-900 flex items-center w-full block flex items-center px-4 py-2 text-white no-underline'
            >
              {t('debit')} &nbsp;&nbsp; <img
                src={GooglePay}
                className='relative h-4 w-8'
                style={{ top: 2 }}
              />{isSafari && <> &nbsp;&nbsp; <img
                src={ApplePay}
                className='relative h-4 w-8'
                style={{ top: 2 }}
              /></>}
            </div>

            <button
              type='button'
              onClick={(e) => { handleOpenWyre(tickerUpcased) }}
              className='w-full block flex items-center px-4 py-2 text-white hover:bg-lightPurple-600 hover:text-white no-underline trans focus:outline-none focus:border-purple-300'
            >
              {t('buyCurrencyName', {
                currencyName: tickerUpcased
              })}
            </button>

            <button
              type='button'
              onClick={(e) => { handleOpenWyre('eth') }}
              className='w-full block flex items-center px-4 py-2 text-white hover:bg-lightPurple-600 hover:text-white no-underline trans focus:outline-none focus:border-purple-300'
            >
              {t('buyCurrencyName', {
                currencyName: 'ETH'
              })}
            </button>
          </PTDropdown>
        </>
      }
    </div>
  </>
}
